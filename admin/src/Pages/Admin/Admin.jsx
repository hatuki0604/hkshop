import React from 'react';
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar';
import {Routes, Route, Outlet} from 'react-router-dom'

const Admin = () => {
    return ( 
    <div className='admin'>
        <Sidebar/>
        <Outlet/>
    </div>
    );
}

export default Admin;