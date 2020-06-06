import React from 'react';
import Navbar from './Navbar';

const MainLayout = (props) => {
    return <>
        <div className="container">
            <Navbar />

            <div className="p-3">
                {props.children}
            </div>
        </div>
    </>
};

export default MainLayout;