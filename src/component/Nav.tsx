// src/components/Nav.js
import React from 'react';
import { Link } from 'react-router-dom';
import { UserProps } from '../types';

const Nav: React.FC<UserProps> = ({ isLoggedIn }) => {
    const logoutUrl = process.env.REACT_APP_LOGOUTURI;
    const loginUrl = process.env.REACT_APP_LOGINURI;
    const goLoginPage = () => {
        if(loginUrl!==undefined) {
            window.location.href = loginUrl;
        }
    };
    const logoutPage = ()=>{
        if(logoutUrl!==undefined) window.location.href =logoutUrl;
    }
    return (
        <div className="btn-group">
            <button type="button" className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                메뉴
            </button>
            <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/Home">Home</Link></li>
                <li><Link className="dropdown-item" to="/MyPage">MyPage</Link></li>
                <li><Link className="dropdown-item" to="/About">About</Link></li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>
                {isLoggedIn ? (
                    <li onClick={logoutPage} className="dropdown-item logout">logout</li>
                ) : (
                    <li onClick={goLoginPage} className="dropdown-item login">login</li>
                )}

            </ul>
        </div>
    );
}

export default Nav;
