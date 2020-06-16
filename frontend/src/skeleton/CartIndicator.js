import React from 'react';
import HyperModal from 'react-hyper-modal';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import PizzaItems from './PizzaItems';
import ExtraItems from './ExtraItems';

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
	}

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
					cart?.pizzas?.length &&
					<PizzaItems cart={cart} restaurantId={restaurantId} />
				}

				{
					cart?.pizzas?.length &&
					<ExtraItems cart={cart} restaurantId={restaurantId} />
				}

				<div className="row">
					<div className="col-6">
						<button className='btn btn-success btn-block'>
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