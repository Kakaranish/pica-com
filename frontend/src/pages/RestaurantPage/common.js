export const sumCartItemsPrices = cart => {
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