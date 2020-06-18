import types from './types';
import bsonObjectId from 'bson-objectid';

const initRestaurantCart = (state, restaurantId) => {
    state[restaurantId] = {
        pizzas: [],
        extras: []
    };
};

const cartsReducer = (state = {}, action) => {
    switch (action.type) {
        case types.CART_ADD_PIZZA: {
            const { restaurantId, pizzaCartItem } = action;
            if (!state[restaurantId]) initRestaurantCart(state, restaurantId);

            state[restaurantId].pizzas.push(Object.assign(pizzaCartItem,
                { cartItemId: bsonObjectId.generate() }));
            return Object.assign({}, state);
        }
        case types.CART_UPDATE_PIZZA_QUANTITY: {
            const { restaurantId, pizzaCartItemId, quantity } = action;
            if (!state[restaurantId]) initRestaurantCart(state, restaurantId);
            state[restaurantId].pizzas.find(p => 
                p.cartItemId == pizzaCartItemId).quantity = quantity
            return Object.assign({}, state);
        }
        case types.CART_REMOVE_PIZZA: {
            const { restaurantId, pizzaCartItemId } = action;
            if (!state[restaurantId]) return state;
            state[restaurantId].pizzas = state[restaurantId].pizzas.filter(p =>
                p.cartItemId != pizzaCartItemId);
            return Object.assign({}, state);
        }
        case types.CART_ADD_EXTRA: {
            const { restaurantId, extraCartItem } = action;
            if (!state[restaurantId]) initRestaurantCart(state, restaurantId);
            state[restaurantId].extras.push(Object.assign(extraCartItem,
                { cartItemId: bsonObjectId.generate() }));
            return Object.assign({}, state);
        }
        case types.CART_UPDATE_EXTRA_QUANTITY: {
            const { restaurantId, extraCartItemId, quantity } = action;
            if (!state[restaurantId]) initRestaurantCart(state, restaurantId);
            state[restaurantId].extras.find(e => 
                e.cartItemId == extraCartItemId).quantity = quantity
            return Object.assign({}, state);
        }
        case types.CART_REMOVE_EXTRA: {
            const { restaurantId, extraCartItemId } = action;
            if (!state[restaurantId]) return state;
            state[restaurantId].extras = state[restaurantId].extras.filter(e =>
                e.cartItemId != extraCartItemId);
            return Object.assign({}, state);
        }
        case types.CART_CLEAR: {
            delete state[action.restaurantId];
            return Object.assign({}, state);
        }
        case types.CART_CLEAR_ALL:
            return {};
        default:
            return state;
    }
};

export default cartsReducer;