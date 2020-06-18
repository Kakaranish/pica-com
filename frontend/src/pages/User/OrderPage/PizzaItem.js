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
        <div className="p-3 mb-2" style={{ border: '1px solid green' }}>
            <p>
                <b>Name</b>: {pizzaItem.pizza.name}&nbsp;
                ({pizzaItem.pizza.price.toFixed(2)} PLN per 1 )
            </p>

            <div>
                <b>Extra Ingredients</b>:<br />
                {
                    pizzaItem.extraIngredients.map((extraIngredient, j) =>
                        <span key={`ei-${j}`}>
                            {extraIngredient.extraIngredient.name}&nbsp;
                            ({extraIngredient.pricePerExtra.toFixed(2)} PLN) <br />
                        </span>
                    )
                }
            </div>

            <br />

            <p>
                <b>Quantity</b>: {pizzaItem.quantity}
            </p>

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