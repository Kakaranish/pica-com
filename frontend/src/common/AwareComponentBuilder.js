import { connect } from 'react-redux';
import * as IdentityActions from './reducers/profileReducer/actions';
import * as NotifsActions from './reducers/notifReducer/actions';
import * as CartActions from './reducers/cartReducer/actions';

class AwareComponentBuilder {
    constructor() {
        this.partialMapStateToPropsList = [];
        this.partialDispatchToPropsList = [];
    }

    withIdentityAwareness() {
        const partialMapDispatch = dispatch => ({
            setIdentity: identity => dispatch(IdentityActions.setIdentity(identity)),
            unsetIdentity: () => dispatch(IdentityActions.unsetIdentity())
        });
        this.partialDispatchToPropsList.push(partialMapDispatch);

        const partialMapState = state => ({
            identity: state.identity
        });
        this.partialMapStateToPropsList.push(partialMapState);

        return this;
    }

    withNotifsAwareness() {
        const partialMapDispatch = dispatch => ({
            setNotifs: notifs => dispatch(NotifsActions.setNotifs(notifs)),
            addNotif: notif => dispatch(NotifsActions.addNotif(notif)),
            removeNotif: notifId => dispatch(NotifsActions.removeNotif(notifId)),
            clearNotifs: () => dispatch(NotifsActions.clearNotifs())
        });
        this.partialDispatchToPropsList.push(partialMapDispatch);

        const partialMapState = state => ({
            notifs: state.notifs
        });
        this.partialMapStateToPropsList.push(partialMapState);

        return this;
    }

    withCartsAwareness() {
        const partialMapDispatch = dispatch => ({
            addPizzaToCart: (restaurantId, pizzaCartItem) => dispatch(
                CartActions.addPizzaToCart(restaurantId, pizzaCartItem)),
            updatePizzaQuantityInCart: (restaurantId, pizzaCartItemId, quantity) =>
                dispatch(CartActions.updatePizzaQuantityInCart(
                    restaurantId, pizzaCartItemId, quantity)),
            removePizzaFromCart: (restaurantId, pizzaCartItemId) => dispatch(
                CartActions.removePizzaFromCart(restaurantId, pizzaCartItemId)),
            addExtraToCart: (restaurantId, extraCartItem) => dispatch(
                CartActions.addExtraToCart(restaurantId, extraCartItem)),
            updateExtraQuantityInCart: (restaurantId, extraCartItemId, quantity) =>
                dispatch(CartActions.updateExtraQuantityInCart(
                    restaurantId, extraCartItemId, quantity)),
            removeExtraFromCart: (restaurantId, extraCartItemId) => dispatch(
                CartActions.removeExtraFromCart(restaurantId, extraCartItemId)),
            clearCart: restaurantId => dispatch(
                CartActions.clearCart(restaurantId)),
            clearAllCarts: () => dispatch(CartActions.clearAllCarts())
        });
        this.partialDispatchToPropsList.push(partialMapDispatch);

        const partialMapState = state => ({
            carts: state.carts
        });
        this.partialMapStateToPropsList.push(partialMapState);

        return this;
    }

    build(funcComponent) {
        const mapStateToProps = state => {
            let result = {};
            this.partialMapStateToPropsList.forEach(x =>
                result = Object.assign(result, x(state)));
            return result;
        }

        const mapDispatchToProps = dispatch => {
            let result = {};
            this.partialDispatchToPropsList.forEach(x =>
                result = Object.assign(result, x(dispatch)));
            return result;
        }

        return connect(mapStateToProps, mapDispatchToProps)(funcComponent);
    }
}

export default AwareComponentBuilder;