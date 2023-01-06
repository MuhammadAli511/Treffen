//simple nav bar with "Trefen" on left side and profile photo on right side with logout button

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

export default function Navbar() {

    return (
        <div className="navbar">
            <div className="navbarLeft">
                <Link to="/" className="navbarLogo">Treffen</Link>
            </div>
            <div className="navbarRight">
                <Link to ="/">
                <button className="navbarLogout">Logout</button>
                </Link>
                
            </div>
        </div>
    )
}