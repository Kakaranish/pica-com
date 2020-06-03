import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MainPage = () => {
    
    const verifyOnClick = async () => {
        const result = await axios.post('/auth/verify');
        if(result.data.user) alert('Logged in');
        else alert('Not logged in');
    }
    
    return <>
        <p>
            <Link to={'/auth/login'} >
                Login
            </Link>
        </p>

        <p>
            <Link to={'/auth/register'} >
                Register
            </Link>
        </p>

        <button className="btn btn-primary" onClick={verifyOnClick}>
            Verify
        </button>

    </>
};

export default MainPage;