import React from 'react';
import loginImage from '../assets/img/login.jpg';
import useLogin from '../hooks/useLogin';
import { handleSubmit } from '../functions/Loginfunctions';

const LoginPage = () => {
    const { userRef, errRef, errMsg, setErrMsg, username, setUsername, password, setPassword,  remember, setRemember, navigate } = useLogin();
    return (
        <>
            <div className='d-flex vh-100 justify-content-center align-items-center text-center signinpage'>
                <div className='p-3 w-25'>
                    <form onSubmit={(e) => handleSubmit(e, username, password, navigate, remember, setErrMsg, errRef)}>
                        <section>
                            <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">
                                {errMsg}
                            </p>
                        </section>
                        <img
                            className="mb-4"
                            src={loginImage} // replace with your image path
                            alt=""
                            width="72"
                            height="57"
                        />
                        <h1 className="h3 mb-3 fw-normal">Sign In</h1>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="uname"
                                placeholder="name@example.com"
                                value={username}
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="uname">User Name</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="pass"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="pass">Password</label>
                        </div>
                        <div className="checkbox mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />&nbsp;&nbsp;
                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        {/* <br /> */}
                        <button className="btn btn-primary" type="submit">Sign in</button>
                    </form>


                </div>
            </div>
        </>
    )
}

export default LoginPage



