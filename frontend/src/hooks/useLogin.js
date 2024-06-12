import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('token');
        if (auth) {
            navigate('/landingannot');
        }
    }, [navigate]);

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            setUsername(rememberedUsername);
            setRemember(true);
        }
        userRef.current.focus();
    }, []);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);



    return {
        userRef,
        errRef,
        errMsg,
        setErrMsg,
        username,
        setUsername,
        password,
        setPassword,
        remember,
        setRemember,        
        navigate
    };
};

export default useLogin;