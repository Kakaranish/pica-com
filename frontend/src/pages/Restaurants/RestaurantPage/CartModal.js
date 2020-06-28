import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import HyperModal from 'react-hyper-modal';
import { toast } from 'react-toastify';
import AwareComponentBuilder from '../../../common/AwareComponentBuilder';
import CartPizzaItems from './CartModal/CartPizzaItems';
import CartExtraItems from './CartModal/CartExtraItems';
import CartPrices from './CartModal/CartPrices';
import { requestHandler } from '../../../common/utils';
import cartIcon from '../../../assets/img/cart.svg';
import deliveryWhiteIcon from '../../../assets/img/delivery-white.svg';

const CartModal = (props) => {

	const restaurantId = props.restaurantId;
	const cart = props.carts[restaurantId];
	const history = useHistory();

	const getNumberOfItemsInCart = () => {
		if (!cart) return 0;
		return cart.pizzas.length + cart.extras.length;
	};

	const clearCart = () => {
		const confirmText = 'Do you want to clear cart?';
		if (window.confirm(confirmText)) {
			props.clearCart(restaurantId);
			toast('Cart cleared');
		}
	};

	const onFinalize = async () => {
		if (!window.confirm("Do you really want to finalize cart?"))
			return;

		let cart = props.carts[restaurantId];

		let formData = { restaurantId };
		formData.pizzas = cart.pizzas.map(pizzaCartItem => ({
			quantity: pizzaCartItem.quantity,
			pizzaId: pizzaCartItem.pizza._id,
			extraIngredients: pizzaCartItem.extraIngredients.map(extraIngr =>
				extraIngr._id)
		}));
		formData.extras = cart.extras.map(extraCartItem => ({
			quantity: extraCartItem.quantity,
			extraId: extraCartItem.extra._id,
		}));

		const action = async () => axios.post('/orders', formData,
			{ validateStatus: false });
		await requestHandler(action, {
			status: 200,
			callback: async orderId => {
				props.clearCart(restaurantId);
				const uri = `/user/orders/${orderId}/step/delivery-address`;
				history.push(uri);
			}
		});
	};

	const minFreeDeliveryPrice = props.minFreeDeliveryPrice;
	const cartItemsPrice = sumCartItemsPrices(cart);
	const deliveryPrice = cartItemsPrice >= minFreeDeliveryPrice
		? 0
		: props.deliveryPrice;
	const toFreeDelivery = minFreeDeliveryPrice - cartItemsPrice;

	const renderOpenButton = requestOpen => <>
		<div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={requestOpen}>
			<img src={cartIcon} className="pb-2 mr-2" style={{ width: '25px' }} />
			<h4 className="text-white align-self-center">
				Go to cart&nbsp;
			</h4>
			<b className="text-white align-self-center">
				({cartItemsPrice.toFixed(2)}PLN
				&nbsp;+&nbsp;
				<img src={deliveryWhiteIcon} style={{ width: '25px' }} />
				{
					deliveryPrice
						? <>{deliveryPrice.toFixed(2)}PLN</>
						: 'FREE'
				}
				)
			</b>
		</div>
	</>

	if (getNumberOfItemsInCart() === 0) return <></>
	return <>
		<HyperModal renderOpenButton={requestOpen => renderOpenButton(requestOpen)}
			classes={{ contentClassName: "h-100" }}>

			<div className="mt-2 p-4">
				<h3>Items in your shopping cart</h3>

				{
					cart?.pizzas?.length > 0 &&
					<CartPizzaItems cart={cart} restaurantId={restaurantId} />
				}

				{
					cart?.extras?.length > 0 &&
					<CartExtraItems cart={cart} restaurantId={restaurantId} />
				}

				<CartPrices cartItemsPrice={cartItemsPrice}
					deliveryPrice={deliveryPrice}
					toFreeDelivery={toFreeDelivery} />

				<div className="row mt-2">
					<div className="col-6">
						<button className='btn btn-success btn-block' onClick={onFinalize}>
							Finalize
						</button>
					</div>

					<div className="col-6">
						<button className='btn btn-danger btn-block' onClick={clearCart}>
							Clear
						</button>
					</div>
				</div>
			</div>
		</HyperModal>
	</>
};

function sumCartItemsPrices(cart) {
	let totalPrice = 0;
	cart.pizzas.forEach(pizzaCartItem => {
		let extraIngredientsPrice = pizzaCartItem.extraIngredients.map(
			extraIngrCartItem => extraIngrCartItem.price)
			.reduce((l, r) => l + r, 0)
		totalPrice += pizzaCartItem.quantity * (pizzaCartItem.pizza.price +
			extraIngredientsPrice);
	});

	cart.extras.forEach(extraCartItem =>
		totalPrice += extraCartItem.quantity * extraCartItem.extra.price);
	return totalPrice;
};

export default new AwareComponentBuilder()
	.withCartsAwareness()
	.build(CartModal);