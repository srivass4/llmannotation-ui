import axios from "axios";

export const handleSubmit = async (event, username, password, navigate, remember, setErrMsg, errRef) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', JSON.stringify({ username, password }), {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (res?.data?.status === 200) {
            navigate('/landingannot');
            localStorage.setItem('user', JSON.stringify(res?.data?.user));
            localStorage.setItem('token', JSON.stringify(res?.data?.auth));
            if (remember) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
        }
        else {
            navigate('/');
            const err = res.data
            setErrMsg(err.message);
            errRef.current.focus();
        }
    }).catch((error) => {
        if (!error?.res) {
            setErrMsg('No Server Response');
        } else if (error?.res?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (error?.res?.status === 401) {
            setErrMsg('Unauthorized');
        }
        else {
            setErrMsg("Login Failed");
        }
        errRef.current.focus();
    });
};