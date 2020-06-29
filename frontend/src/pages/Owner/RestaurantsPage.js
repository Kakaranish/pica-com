import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestHandler } from '../../common/utils';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TabHeader from './components/TabHeader';
import AcceptedRestaurants from './components/RestaurantsPage/AcceptedRestaurants';
import PendingRestaurants from './components/RestaurantsPage/PendingRestaurants';
import RejectedRestaurants from './components/RestaurantsPage/RejectedRestaurants';
import CancelledRestaurants from './components/RestaurantsPage/CancelledRestaurants';
import TabContent from './components/TabContent';
import DraftRestaurants from './components/RestaurantsPage/DraftRestaurants';

const RestaurantsPage = () => {

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/owner/restaurants/preview');
            const result = await requestHandler(action);
            setState({ loading: false, restaurants: result });
        };

        fetch();
    }, []);

    if (state.loading) return <></>

    const draftRestaurants = state.restaurants.filter(r => r.status === 'DRAFT');
    const pendingRestaurants = state.restaurants.filter(r => r.status === 'PENDING');
    const acceptedRestaurants = state.restaurants.filter(r => r.status === 'ACCEPTED');
    const rejectedRestaurants = state.restaurants.filter(r => r.status === 'REJECTED');
    const cancelledRestaurants = state.restaurants.filter(r => r.status === 'CANCELLED');

    return <>

        <h3 className="mb-3">Your restaurants</h3>

        <Link to='/owner/restaurants/create'
            className="d-flex align-items-center text-decoration-none mb-4">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Restaurant
            </div>
        </Link>

        <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <TabHeader title='Draft' uniqueInitial='nav-draft' isActive={true} />
                <TabHeader title='Pending' uniqueInitial='nav-pending' />
                <TabHeader title='Accepted' uniqueInitial='nav-accepted' />
                <TabHeader title='Rejected' uniqueInitial='nav-rejected' />
                <TabHeader title='Cancelled' uniqueInitial='nav-cancelled' />
            </div>
        </nav>

        <div className="tab-content">
            <TabContent uniqueInitial='nav-draft' isActive={true}>
                <DraftRestaurants restaurants={draftRestaurants} />
            </TabContent>

            <TabContent uniqueInitial='nav-pending'>
                <PendingRestaurants restaurants={pendingRestaurants} />
            </TabContent>

            <TabContent uniqueInitial='nav-accepted'>
                <AcceptedRestaurants restaurants={acceptedRestaurants} />
            </TabContent>

            <TabContent uniqueInitial='nav-rejected'>
                <RejectedRestaurants restaurants={rejectedRestaurants} />
            </TabContent>

            <TabContent uniqueInitial='nav-cancelled'>
                <CancelledRestaurants restaurants={cancelledRestaurants} />
            </TabContent>
        </div>
    </>
};

export default RestaurantsPage;