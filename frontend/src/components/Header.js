import React from 'react';
import lnlogo from '../assets/img/ln-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { clearData, handleLogout } from '../functions/Dashboardfunctions';

const Header = ({ user, setSearchResults, setDropdownOptions, setErrMsg }) => {
    const navigate = useNavigate();
    return (
        <header className="mainheader">
            <nav
                className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
                data-bs-theme="dark"
            >
                <div className="container-fluid">
                    <img src={lnlogo} alt="" srcSet="" />
                    <label className="navbar-brand">Annotation Extraction</label>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/landingannot" className="nav-link active" aria-current="page" onClick={(e) => clearData(e, setSearchResults, setDropdownOptions)}>
                                    Home
                                </Link>
                            </li>
                        </ul>
                        <button className="btn btn-outline-success" onClick={(e) => handleLogout(e, setSearchResults, setErrMsg, navigate)}>
                            Logout ({JSON.parse(user)})
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
