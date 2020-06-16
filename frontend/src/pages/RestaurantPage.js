import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler } from '../common/utils';
import PizzaItem from './RestaurantPage/PizzaItem';
import ExtraItem from './RestaurantPage/ExtraItem';
import RestaurantInfoHeader from './RestaurantPage/RestaurantInfoHeader';
import BottomBar from './RestaurantPage/BottomBar';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import CartIndicator from '../skeleton/CartIndicator';

const RestaurantPage = (props) => {

    const restaurantId = props.match.params.id;

    const [state, setState] = useState({ loading: true });
    const [empty, setEmpty] = useState(true);
    
    useEffect(() => {
        const fetch = async () => {
            const uri = `/restaurants/${restaurantId}/populated`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const restaurant = await requestHandler(action);
            setState({ loading: false, restaurant });
        };
        fetch();
    }, []);

    const onPizzaAddToCart = pizzaCartItem => {
        props.addPizzaToCart(restaurantId, pizzaCartItem);
    };

    const onExtraAddToCart = extraCartItem => {
        props.addExtraToCart(restaurantId, extraCartItem);
        setEmpty(false);
    };

    useEffect(() => { window.scrollBy(0, 80) }, [empty]);

    if (state.loading) return <></>
    else if (!state?.restaurant) return <h3>No such restaurant</h3>
    return <>

        <RestaurantInfoHeader restaurant={state.restaurant} />

        <CartIndicator restaurantId={restaurantId} />

        <h3>Pizza</h3>
        {
            state.restaurant.menu.pizzas.map((pizza, i) =>
                <div className="p-3 mb-2" style={{ border: '1px solid green' }}
                    key={`p-${i}`}>
                    <PizzaItem pizza={pizza}
                        addToCartCb={onPizzaAddToCart}
                        extraIngredients={state.restaurant.menu.extraIngredients} />
                </div>
            )
        }

        <h3 className="mt-3">Extras</h3>
        {
            state.restaurant.menu.extras.map((extra, i) =>
                <div className="p-3 mb-2" style={{ border: '1px solid green' }}
                    key={`e-${i}`}>
                    <ExtraItem extra={extra} addToCartCb={onExtraAddToCart} />
                </div>
            )
        }

        <BottomBar empty={empty} />
    </>
};

export default new AwareComponentBuilder()
    .withCartsAwareness()
    .build(RestaurantPage);