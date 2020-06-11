import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { requestHandler } from '../../common/utils';
import axios from 'axios';
import RestaurantInfo from './components/RestaurantInfo';
import RestaurantsTab from './components/RestaurantsPage/RestaurantsTab';
import AcceptedRestaurants from './components/RestaurantsPage/AcceptedRestaurants';
import PendingRestaurants from './components/RestaurantsPage/PendingRestaurants';
import RejectedRestaurants from './components/RestaurantsPage/RejectedRestaurants';
import CancelledRestaurants from './components/RestaurantsPage/CancelledRestaurants';

const RestaurantsPage = () => {

    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/owner/restaurants');
            const result = await requestHandler(action);
            setState({ loading: false, restaurants: result });
        };

        fetch();
    }, []);

    if (state.loading) return <></>

    const draftRestaurant = state.restaurants.find(r => r.status === 'DRAFT');
    const pendingRestaurants = state.restaurants.filter(r => r.status === 'PENDING');
    const acceptedRestaurants = state.restaurants.filter(r => r.status === 'ACCEPTED');
    const rejectedRestaurants = state.restaurants.filter(r => r.status === 'REJECTED');
    const cancelledRestaurants = state.restaurants.filter(r => r.status === 'CANCELLED');

    return <>

        {
            draftRestaurant &&
            <>
                <h3>In draft</h3>
                <RestaurantInfo restaurant={draftRestaurant} >
                    <Link to={`/owner/restaurants/${draftRestaurant._id}/edit`}
                        className="btn btn-secondary">
                        Edit
                    </Link>

                </RestaurantInfo>
            </>
        }

        <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">

                <RestaurantsTab title='Accepted' status={'ACCEPTED'}
                    isSelected={true} />

                <RestaurantsTab title='Pending' status={'PENDING'} />

                <RestaurantsTab title='Rejected' status={'REJECTED'} />

                <RestaurantsTab title='Cancelled' status={'CANCELLED'} />

            </div>
        </nav>
        <div className="tab-content">

            <AcceptedRestaurants restaurants={acceptedRestaurants} isActive={true} />

            <PendingRestaurants restaurants={pendingRestaurants} />

            <RejectedRestaurants restaurants={rejectedRestaurants} />

            <CancelledRestaurants restaurants={cancelledRestaurants} />

        </div>

        <Link to='/owner/restaurants/create' className="btn btn-primary" >
            Create Restaurant
        </Link>
    </>
};

export default RestaurantsPage;