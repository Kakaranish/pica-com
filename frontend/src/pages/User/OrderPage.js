import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../common/utils';

const OrderPage = ({ match }) => {

	const orderId = match.params.id;

	const [state, setState] = useState({ loading: true });
	useEffect(() => {
		const fetch = async () => {
			const uri = `/orders/${orderId}`;
			const action = async () => axios.get(uri, { validateStatus: false });
			const order = await requestHandler(action);
			console.log(order);
			setState({ loading: false, order });
		};
		fetch();
	}, []);

	if (state.loading) return <></>
	else if (!state.order) return <h3>There is no such order</h3>

	const calcSinglePizzaPrice = pizzaItem => {
		const extraIngrsPrice = pizzaItem.extraIngredients.map(e => e.pricePerExtra)
			.reduce((l, r) => l + r, 0);
		return pizzaItem.pricePerPizza + extraIngrsPrice;
	}
	const calcPizzaItemPrice = pizzaItem =>
		pizzaItem.quantity * calcSinglePizzaPrice(pizzaItem);

	return <>
		<p>
			<b>Order: </b> {orderId}
		</p>

		<p>
			<b>Created At:</b> {state.order.createdAt}
		</p>

		<p>
			<b>Restaurant: </b>&nbsp;
			<Link to={`/restaurants/${state.order.restaurant._id}`}>
				{state.order.restaurant.name}
			</Link>
		</p>

		<p>
			<b>Status: </b> {state.order.status}
		</p>

		{/* Placeholder */}
		<p>
			<Link to={'/'} className='btn btn-primary'>
				Watch order progress
			</Link>
		</p>

		<h3>Ordered Items</h3>

		<h4>Pizzas</h4>
		{
			state.order.pizzas.map((pizzaCartItem, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid green' }}
					key={`p-${i}`}>
					<p>
						<b>Name</b>: {pizzaCartItem.pizza.name}&nbsp;
						({pizzaCartItem.pizza.price.toFixed(2)} PLN per 1 )
					</p>

					<div>
						<b>Extra Ingredients</b>:<br />
						{
							pizzaCartItem.extraIngredients.map((extraIngredient, j) =>
								<span key={`ei-${j}`}>
									{extraIngredient.extraIngredient.name}&nbsp;
									({extraIngredient.pricePerExtra.toFixed(2)} PLN) <br />
								</span>
							)
						}
					</div>

					<br />

					<p>
						<b>Quantity</b>: {pizzaCartItem.quantity}
					</p>

					<p>
						<b>Total price: </b>
						{pizzaCartItem.quantity} x&nbsp;
						{calcSinglePizzaPrice(pizzaCartItem).toFixed(2)}PLN =&nbsp;
						{calcPizzaItemPrice(pizzaCartItem).toFixed(2)}PLN
					</p>
				</div>
			)
		}

		<h4>Extras</h4>
		{
			state.order.extras.map((extraItem, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid green' }}
					key={`e-${i}`}>
					<p>
						<b>Name</b>: {extraItem.extra.name}&nbsp;
						({extraItem.extra.price.toFixed(2)} PLN)
					</p>
				</div>
			)
		}

		<h4 className="mb-4">
			Delivery Price: {state.order.deliveryPrice.toFixed(2)}PLN
		</h4>

		<h3>
			Total Price:&nbsp;
			<span style={{ color: 'green' }}>
				{state.order.totalPrice.toFixed(2)} PLN
			</span>
		</h3>
	</>
};

export default OrderPage;