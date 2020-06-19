import React from 'react';
import PizzaItem from './PizzaItem';
import ExtraItem from './ExtraItem';

const OrderedItems = ({ order }) => {
	return <>
		<div className="accordion" id="orderedAccordion">
			<div className="card">
				<div className="card-header" id="orderedHeading" data-toggle="collapse"
					data-target="#orderedCollapse" aria-expanded="true"
					aria-controls="orderedCollapse"
					style={{ cursor: 'pointer' }}>

					<h4 className="align-content-lg-end btn-link">
						Ordered Items
					</h4>
				</div>

				<div id="orderedCollapse" className="collapse"
					aria-labelledby="orderedHeading" data-parent="#orderedAccordion">

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

						<h6 className="mt-4 mb-1">
							Delivery Price:&nbsp;
							{
								order.deliveryPrice > 0
									? `${order.deliveryPrice.toFixed(2)}PLN`
									: <span className="text-success">
											Free
									</span>
							}
						</h6>

						<h3>
							Total Price:&nbsp;
							<span>
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