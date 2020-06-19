import React from 'react';

const PizzaItem = ({ pizzaItem }) => {

	const calcSinglePizzaPrice = pizzaItem => {
		const extraIngrsPrice = pizzaItem.extraIngredients.map(e => e.pricePerExtra)
			.reduce((l, r) => l + r, 0);
		return pizzaItem.pricePerPizza + extraIngrsPrice;
	}
	const calcPizzaItemPrice = pizzaItem =>
		pizzaItem.quantity * calcSinglePizzaPrice(pizzaItem);

	return <>
		<div className="p-3 mb-2 border border-darken-1">
			<p>
				<b>{pizzaItem.pizza.name} </b>
				<span style={{ color: 'gray' }}>
					({pizzaItem.pizza.price.toFixed(2)}PLN)
				</span>
				
				<br/>

				{pizzaItem.pizza.description}
			</p>

			{
				pizzaItem.extraIngredients.length > 0 && <p>
					<b>Extra Ingredients</b>:&nbsp;
					{
						pizzaItem.extraIngredients.map((extraIngredient, j) =>
							<span key={`ei-${j}`}>
								{extraIngredient.extraIngredient.name}&nbsp;

								<span style={{ color: 'gray' }}>
									({extraIngredient.pricePerExtra.toFixed(2)} PLN)
									{j !== pizzaItem.extraIngredients.length - 1 && ', '}
								</span>
							</span>
						)
					}
				</p>
			}

			<p>
				<b>Total price: </b>
				{pizzaItem.quantity} x&nbsp;
				{calcSinglePizzaPrice(pizzaItem).toFixed(2)}PLN =&nbsp;
				{calcPizzaItemPrice(pizzaItem).toFixed(2)}PLN
			</p>
		</div>
	</>
};

export default PizzaItem;