import React from 'react';
import Navbar from './Navbar';

const MainLayout = (props) => {
    return <>
        <Navbar />
        <div className="container mt-2">
            <div className="p-3">
                {props.children}
            </div>
        </div>
    </>
};

export default MainLayout;