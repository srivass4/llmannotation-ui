const mysql = require('mysql'); 
const db = mysql.createConnection({
    host: 'in-cases.ckulv8lpkyxc.ap-southeast-1.rds.amazonaws.com',
    user: 'svc-incasesdevops',
    password: 'tXne.upsp2_A3Q%L',
    database: 'SHUKLAS3'
})

db.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;