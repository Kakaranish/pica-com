import React from 'react';
import AwareComponentBuilder from '../../../../common/AwareComponentBuilder';
import QuantityInput from '../QuantityInput';

const CartExtraItems = (props) => {

	const { cart, restaurantId } = props;

	const getPrice = extraCartItem => extraCartItem.extra.price *
		extraCartItem.quantity;

	const onQuantityChange = (extraCartItem, quantity) =>
		props.updateExtraQuantityInCart(restaurantId, extraCartItem.cartItemId, quantity);

	const onUnderMinAttempt = extraCartItem => {
		const confirmText = 'Do you want to remove this product from cart?';
		if (window.confirm(confirmText))
			props.removeExtraFromCart(restaurantId, extraCartItem.cartItemId);
	}

	return <>
		{
			cart.extras.map((extraCartItem, i) =>
				<div key={`c-e-${i}`} className='mb-3 p-2'
					style={{ border: '1px solid red' }}>

					<b>{extraCartItem.extra.name}</b><br />

					<div style={{ display: 'flex' }}>
						<QuantityInput defaultValue={extraCartItem.quantity}
							classes={'mr-3'} minValue={1}
							onUnderMinAttempt={() => onUnderMinAttempt(extraCartItem)}
							onQuantityChange={quantity => onQuantityChange(extraCartItem, quantity)} />

						<div>
							Price: {extraCartItem.extra.price.toFixed(2)} PLN x&nbsp;
							{extraCartItem.quantity} =&nbsp;
							{getPrice(extraCartItem).toFixed(2)} PLN
						</div>
					</div>
				</div>
			)
		}
	</>
};

export default new AwareComponentBuilder()
	.withCartsAwareness()
	.build(CartExtraItems);