import types from './types';

export const addPizzaToCart = (restaurantId, pizzaCartItem) => ({
    type: types.CART_ADD_PIZZA, restaurantId, pizzaCartItem
});

export const updatePizzaQuantityInCart = (restaurantId, pizzaCartItemId, quantity) => ({
    type: types.CART_UPDATE_PIZZA_QUANTITY, restaurantId, pizzaCartItemId, quantity
});

export const removePizzaFromCart = (restaurantId, pizzaCartItemId) => ({
    type: types.CART_REMOVE_PIZZA, restaurantId, pizzaCartItemId
});

export const addExtraToCart = (restaurantId, extraCartItem) => ({
    type: types.CART_ADD_EXTRA, restaurantId, extraCartItem
});

export const updateExtraQuantityInCart = (restaurantId, extraCartItemId, quantity) => ({
    type: types.CART_UPDATE_EXTRA_QUANTITY, restaurantId, extraCartItemId, quantity
});

export const removeExtraFromCart = (restaurantId, extraCartItemId) => ({
    type: types.CART_REMOVE_EXTRA, restaurantId, extraCartItemId
});

export const clearCart = restaurantId => ({
    type: types.CART_CLEAR, restaurantId
});

export const clearAllCarts = () => ({
    type: types.CART_CLEAR_ALL
});