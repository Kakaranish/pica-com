import React, { useState, useEffect } from 'react';
import TabContent from './TabContent';
import axios from 'axios';
import { requestHandler } from '../../../../common/utils';

const Restaurants = ({ currentTab, status, showRestaurants }) => {

    const uniqueInitial = `navbar-${status}`;
    const isActive = currentTab === uniqueInitial;
    const [restaurants, setRestaurants] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const uri = `/admin/restaurants/status/${status}`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const result = await requestHandler(action);
            setRestaurants(result);
        };

        if (!restaurants && uniqueInitial === currentTab) fetch();
    }, [currentTab]);

    if (!isActive || !restaurants) return <></>
    else if (!restaurants.length) return <>
        <TabContent isActive={isActive} uniqueInitial={'navbar-acccepted'}>
            <h3>No restaurants</h3>
        </TabContent>
    </>

    return <>
        <TabContent isActive={isActive} uniqueInitial={uniqueInitial}>
            {
                showRestaurants(restaurants)
            }
        </TabContent>
    </>
};

export default Restaurants;