import React from 'react';
import QuantityInput from './QuantityInput';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const PizzaItems = (props) => {

	const { cart, restaurantId } = props;

	const getSinglePizzaPrice = pizzaCartItem => {
		const ingredientsPrice = pizzaCartItem.extraIngredients.map(e => e.price)
			.reduce((l, r) => l + r, 0);
		return pizzaCartItem.pizza.price + ingredientsPrice;
	}

	const getPrice = pizzaCartItem => getSinglePizzaPrice(pizzaCartItem) *
		pizzaCartItem.quantity;

	const onQuantityChange = (pizzaCartItem, quantity) =>
		props.updatePizzaQuantityInCart(restaurantId, pizzaCartItem.cartItemId, quantity)

	const onUnderMinAttempt = pizzaCartItem => {
		const confirmText = 'Do you want to remove this product from cart?';
		if (window.confirm(confirmText))
			props.removePizzaFromCart(restaurantId, pizzaCartItem.cartItemId);
	};

	return <>
		{
			cart.pizzas.map((pizzaCartItem, i) =>
				<div key={`c-p-${i}`} className='mb-3 p-2' style={{ border: '1px solid red' }}>
					<div className="my-2">
						<b>{pizzaCartItem.pizza.name}</b><br />

						{pizzaCartItem.pizza.description}<br />

						{
							!pizzaCartItem.extraIngredients.length ? ''
								: <>
									Extra ingredients:&nbsp;
                                {
										pizzaCartItem.extraIngredients.map((ingr, j) =>
											<span key={`ingr-${j}`} style={{ color: 'gray' }}>
												{ingr.name}
												{
													(j !== pizzaCartItem.extraIngredients.length - 1)
														? ', '
														: ''
												}
											</span>)
									}
								</>
						}

					</div>

					<div style={{ display: 'flex' }}>
						<QuantityInput defaultValue={pizzaCartItem.quantity}
							classes={'mr-3'} minValue={1}
							onUnderMinAttempt={() => onUnderMinAttempt(pizzaCartItem)}
							onQuantityChange={quantity => onQuantityChange(pizzaCartItem, quantity)} />

						<div>
							Price: {getSinglePizzaPrice(pizzaCartItem).toFixed(2)} PLN x&nbsp;
							{pizzaCartItem.quantity} =&nbsp;
							{getPrice(pizzaCartItem).toFixed(2)} PLN
						</div>
					</div>
				</div>
			)
		}
	</>
};

export default new AwareComponentBuilder()
	.withCartsAwareness()
	.build(PizzaItems);