import React, { useState, useEffect } from 'react';

const EditPizzaPage = () => {
    
    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            
        };
        fetch();
    }, []);
    
    return <>
        EditPizzaPage
    </>
};

export default EditPizzaPage;