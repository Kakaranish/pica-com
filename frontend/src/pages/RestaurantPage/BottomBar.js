import React from 'react';

const BottomBar = ({ empty }) => {
    return <>
        <div className="fixed-bottom">
            {
                empty ?
                    <div className="container" style={{ border: '1px solid red' }}>
                        XD
                    </div>
                    :
                    <>
                        <div className="container bg-dark" style={{ border: '1px solid red', height: '80px' }}>
                            XD
                        </div>
                    </>
            }
        </div>

        {
            !empty &&
            <div style={{ height: '80px' }}></div>
        }
    </>
};

export default BottomBar;