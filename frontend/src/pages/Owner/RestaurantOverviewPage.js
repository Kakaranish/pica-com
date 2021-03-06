import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import RestaurantOverview from '../../common/components/RestaurantOverview';
import { changeStatus } from './common/utils';

const RestaurantOverviewPage = ({ match }) => {

    const restaurantId = match.params.id;
    const history = useHistory();

    const [state, setState] = useState({ loading: true });

    useEffect(() => {
        const fetch = async () => {
            const uri = `/owner/restaurants/${restaurantId}/populated`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, restaurant: result });
        };
        fetch();
    }, []);

    if (state.loading) return <></>
    else if (!state.restaurant) return <Redirect to={'/error/404'} />
    return <>
        <RestaurantOverview restaurant={state.restaurant}>
            {
                ["PENDING", "ACCEPTED", "CANCELLED"].includes(
                    state.restaurant.status) &&
                <button className="btn btn-primary mr-3"
                    onClick={async () => {
                        await changeStatus(state.restaurant._id, 'draft');
                        history.goBack();
                    }}>
                    Make draft
                </button>
            }

            {
                ["DRAFT", "ACCEPTED", "CANCELLED"].includes(
                    state.restaurant.status) &&
                <button className="btn btn-primary mr-3"
                    onClick={async () => {
                        await changeStatus(state.restaurant._id, 'pending');
                        history.goBack();
                    }}>
                    Make pending
                </button>
            }

            {
                ["DRAFT", "PENDING", "ACCEPTED"].includes(
                    state.restaurant.status) &&
                <button className="btn btn-primary mr-3"
                    onClick={async () => {
                        await changeStatus(state.restaurant._id, 'cancelled');
                        history.goBack();
                    }}>
                    Make cancelled
                </button>
            }
        </RestaurantOverview>
    </>
};

export default RestaurantOverviewPage;