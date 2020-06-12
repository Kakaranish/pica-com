import React, { useState } from 'react';
import TabHeader from './RestaurantsPage/TabHeader';
import PendingRestaurants from './RestaurantsPage/PendingRestaurants';
import AcceptedRestaurants from './RestaurantsPage/AcceptedRestaurants';
import RejectedRestaurants from './RestaurantsPage/RejectedRestaurants';
import CancelledRestaurants from './RestaurantsPage/CancelledRestaurants';

const RestaurantsPage = () => {

    const [currentTab, setCurrentTab] = useState('navbar-pending');

    return <>
        <h3>Restaurants</h3>

        <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <TabHeader title={'PENDING'} uniqueInitial={'navbar-pending'}
                setCurrentTab={setCurrentTab} currentTab={currentTab} />

            <TabHeader title={'ACCEPTED'} uniqueInitial={'navbar-accepted'}
                setCurrentTab={setCurrentTab} currentTab={currentTab} />

            <TabHeader title={'REJECTED'} uniqueInitial={'navbar-rejected'}
                setCurrentTab={setCurrentTab} currentTab={currentTab} />

            <TabHeader title={'CANCELLED'} uniqueInitial={'navbar-cancelled'}
                setCurrentTab={setCurrentTab} currentTab={currentTab} />
        </div>

        <div className="tab-content">
            <PendingRestaurants currentTab={currentTab} />

            <AcceptedRestaurants currentTab={currentTab} />

            <RejectedRestaurants currentTab={currentTab} />

            <CancelledRestaurants currentTab={currentTab} />
        </div>
    </>
};

export default RestaurantsPage;