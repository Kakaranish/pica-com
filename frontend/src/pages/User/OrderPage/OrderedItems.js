import React from 'react';
import PizzaItem from './PizzaItem';
import ExtraItem from './ExtraItem';

const OrderedItems = ({ order }) => {
	return <>
		<div className="accordion" id="orderedAccordion">
			<div className="card">
				<div className="card-header" id="headingOne" data-toggle="collapse"
					data-target="#collapseOne" aria-expanded="true"
					aria-controls="collapseOne"
					style={{ cursor: 'pointer' }}>

					<h3 className="align-content-lg-end btn-link">
						Ordered Items
					</h3>
				</div>

				<div id="collapseOne" className="collapse" aria-labelledby="headingOne"
					data-parent="#orderedAccordion">

					<div className="card-body">
						<h4>Pizzas</h4>
						{
							order.pizzas.map((pizzaItem, i) =>
								<PizzaItem pizzaItem={pizzaItem} key={`pi-${i}`} />
							)
						}

						{
							order.extras.length > 0 && <>
								<h4>Extras</h4>
								{
									order.extras.map((extraItem, i) =>
										<ExtraItem extraItem={extraItem} key={`ei-${i}`} />
									)
								}
							</>
						}

						<h4 className="mb-4">
							Delivery Price: {order.deliveryPrice.toFixed(2)}PLN
						</h4>

						<h3>
							Total Price:&nbsp;
							<span style={{ color: 'green' }}>
								{order.totalPrice.toFixed(2)} PLN
							</span>
						</h3>

					</div>
				</div>
			</div>
		</div>
	</>
};

export default OrderedItems;