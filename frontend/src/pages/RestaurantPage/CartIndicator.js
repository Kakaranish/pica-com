import React from 'react';
import HyperModal from 'react-hyper-modal';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';
import PizzaItems from './PizzaItems';
import ExtraItems from './ExtraItems';
import axios from 'axios';
import { requestHandler } from '../../common/utils';

const CartIndicator = (props) => {

	const restaurantId = props.restaurantId;
	const cart = props.carts[restaurantId];

	const getNumberOfItemsInCart = () => {
		if (!cart) return 0;
		return cart.pizzas.length + cart.extras.length;
	};

	const clearCart = () => {
		const confirmText = 'Do you want to clear cart?';
		if (window.confirm(confirmText))
			props.clearCart(restaurantId)
	};

	const onFinalize = async () => {

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
			status: 400,
			callback: async res => console.log(res)
		});
	};

	const renderOpenButton = requestOpen => <>
		<button className="btn btn-primary" onClick={requestOpen}>
			Show cart
		</button>
	</>

	if (getNumberOfItemsInCart() === 0) return <></>
	return <>

		<p>
			Cart items count: {getNumberOfItemsInCart()}
		</p>

		<HyperModal renderOpenButton={requestOpen => renderOpenButton(requestOpen)}>

			<div className="mt-2 p-4">
				<h3>Items in your shopping cart</h3>

				{
					cart?.pizzas?.length > 0 &&
					<PizzaItems cart={cart} restaurantId={restaurantId} />
				}

				{
					cart?.extras?.length > 0 &&
					<ExtraItems cart={cart} restaurantId={restaurantId} />
				}

				<div className="row">
					<div className="col-6">
						<button className='btn btn-success btn-block'
							onClick={onFinalize}>
							Finalize
						</button>
					</div>
					<div className="col-6">
						<button className='btn btn-danger btn-block'
							onClick={clearCart}>
							Clear
						</button>
					</div>
				</div>
			</div>
		</HyperModal>
	</>
};

export default new AwareComponentBuilder()
	.withCartsAwareness()
	.build(CartIndicator);