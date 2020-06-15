import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const RefreshPage = () => {
    const history = useHistory();

    useEffect(() => history.goBack());

    return <></>
};

export default RefreshPage;