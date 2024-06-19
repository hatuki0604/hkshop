import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/nav-logo.svg';
import navProfile from '../../assets/nav-profile.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const logout = () => {
        localStorage.removeItem('auth-token');
        window.location.replace("/login");
    }
    return (
        <div className='navbar'>
            <img src={navlogo} alt="" className="nav-logo" />
            <img src={navProfile} alt="" className="nav-profile" />
            <div className='nav-login-cart'>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;
