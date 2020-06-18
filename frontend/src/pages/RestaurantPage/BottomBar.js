import React from 'react';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';
import CartModal from './CartModal';

const BottomBar = (props) => {

	const restaurantId = props.restaurantId;
	const cart = props.carts[restaurantId];

	const cartHasItems = () => cart?.pizzas?.length || cart?.extras?.length;

	return <>
		{
			!!cartHasItems() && <>
				<div className="fixed-bottom">

					<div className="container d-flex align-items-center justify-content-center bg-dark rounded-top"
						style={{ height: '50px' }}>

						<CartModal restaurantId={restaurantId}
							minFreeDeliveryPrice={props.minFreeDeliveryPrice}
							deliveryPrice={props.deliveryPrice} />

					</div>
				</div>

				<div style={{ height: '80px' }}></div>
			</>
		}
	</>
};

export default new AwareComponentBuilder()
	.withCartsAwareness()
	.build(BottomBar);