import React from 'react';
import axios from 'axios';
import HyperModal from 'react-hyper-modal';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';
import PizzaItems from './PizzaItems';
import ExtraItems from './ExtraItems';
import { requestHandler } from '../../common/utils';
import cartIcon from '../../assets/img/cart.svg';
import { useHistory } from 'react-router-dom';

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
		if (window.confirm(confirmText))
			props.clearCart(restaurantId)
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
				history.push(`/user/orders/${orderId}`)
			}
		});
	};

	const renderOpenButton = requestOpen => <>
		<div className="d-flex" style={{ cursor: 'pointer' }} onClick={requestOpen}>
			<img src={cartIcon} className="pb-2 mr-2" style={{ width: '25px' }} />
			<h4 className="text-white">
				Go to cart
			</h4>
		</div>
	</>

	if (getNumberOfItemsInCart() === 0) return <></>
	return <>
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
	.build(CartModal);