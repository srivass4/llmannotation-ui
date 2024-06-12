const express = require('express');
const db = require('./config/db.js')
const cors = require('cors');
const yaml = require('js-yaml');
const fs = require('fs');
const dotenv = require('dotenv');
// Set up Global configuration access
dotenv.config({ path: './config/key.env' });
const Jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
// Read the YAML file
const file = fs.readFileSync('./config/data.yaml', 'utf8');
// Convert file to JSON object
const yamldata = yaml.load(file);
const app = express();
app.use(express.json());
app.use(cors({
    // Allow only this origin
    origin: 'http://localhost:3000', 
     // Allow cookies
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
}));

const port = process.env.PORT;

app.get('/', requireAuth, (req, res) => {
    return res.json({ "status": 200, "message": "Welcome to the Home Page" });
});

app.post('/login', (req, res) => {
    const sql = "select * from testing_HK_usersession where username= ? and password=?";
    db.query(sql, [req.body.username, req.body.password], (error, data) => {
        if (error) return res.json({ "status": 400, "message": error.message });
        if (data.length > 0) {
            const stupdatesql = "update testing_HK_usersession set status=1 where username=?";
            const user = data[0].username;
            db.query(stupdatesql, [req.body.username], (error, data) => {
                if (error) return res.json({ "status": 400, "message": error.message });
            })
            Jwt.sign({ user }, secretKey, { expiresIn: "1h" }, (err, token) => {
                if (err) {
                    res.send(err);
                }
                return res.json({ "status": 200, "user": user, "auth": token })
            });
        } else {
            return res.json({ "message": "Invalid credentials" });
        }
    })
})

app.post('/search', requireAuth, (req, res) => {
    const { query } = req.body;
    const sql = 'SELECT * FROM testing_HK_annotation WHERE file_citation LIKE ?';
    db.query(sql, [`%${query}`], (error, results) => {
        try {
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).json({ error: 'Database query error' });
            }
            else if (!results[0]) {
                return res.status(404).json({ message: 'No records present' });
            }
            else {
                const smesql = "select SME_Annotation_para from testing_HK_annotation where file_citation = ?";
                db.query(smesql, [results[0].file_citation], (error, smeData) => {
                    if (error) {
                        console.error('SME query error:', error);
                        res.status(500).json({ error: 'SME query error' });
                        return;
                    }
                    const uniqueSmeValues = [...new Set(smeData.map(item => item.SME_Annotation_para))];
                    // Include SME data in the response
                    return res.status(200).json({ results, uniqueSmeValues });
                });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    ); // Add a comma here
});

function requireAuth(req, resp, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1];
        // console.warn("Middleware called", token);
        Jwt.verify(token, secretKey, (err, valid) => {
            if (err) {
                resp.status(401).send({ result: "Please provide valid toekn" });
            } else {
                next();
            }
        });
    } else {        
        resp.status(403).send({ result: "Please add toekn with header" });
        
    }
}

app.get('/dashboard', requireAuth, async (req, res) => {
    // Get user from session
    // res.render('dashboard', { user: req.session.user });
    res.status(200).json({ message: 'Accessed profile page' });
});

app.post('/logout', (req, res) => {
    const stupdatesql = "update testing_HK_usersession set status=0 where username=?";
    db.query(stupdatesql, [req.body.username], (error, data) => {
        if (error) 
            {
                return res.json({ "status": 400, "message": error.message });
            }
            else{
                return res.status(200).json({ message: 'Logout successful'});
            }
    });
});

app.post('/updateannotation', requireAuth, (req, res) => {
    const { smeValue, paragraphid } = req.body;
    const smesql = 'UPDATE testing_HK_annotation SET SME_Annotation_para = ?, flag = ?, update_date = CURRENT_TIMESTAMP WHERE id = ?';
    db.query(smesql, [smeValue, "True", paragraphid], (error) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query error' });
        }
    });
    return res.json({ "status": 200, "message": "SME and Flag updated successfully" });
});

app.get('/getEditedStatus', requireAuth, (req, res) => {
    const sql = 'SELECT id FROM testing_HK_annotation WHERE flag = "True"';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query error' });
        }
        return res.json(results);
    });
});

app.post('/gethtmlfile', requireAuth, (req, res) => {
    const item = yamldata.files.find(item => item.file_citation === req.body.file_citation);
    // If such an object is found, return its body
    if (item) {
        res.send(item.body.replace(/-/g, ''));
    } else {
        // If no such object is found, send an error message
        res.status(403).send('No item with the given file_citation found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});




