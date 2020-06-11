import React from 'react';
import { Link } from 'react-router-dom';
import PizzaItem from './PizzaItem';

const PizzasTab = ({ restaurantId, pizzas }) => {

    if (!pizzas?.length) return <>
        <h3>No pizzas yet</h3>

        <Link to={`/owner/restaurants/${restaurantId}/create/pizza`}
            className="btn btn-success">
            Create Pizza
        </Link>
    </>

    return <>
        {
            pizzas.map((pizza, i) =>
                <div className="p-3 mb-3" style={{ border: '1px solid blue' }} key={`p-${i}`}>
                    <PizzaItem pizza={pizza} />
                </div>
            )
        }

        <Link to={`/owner/restaurants/${restaurantId}/create/pizza`}
            className="btn btn-success">
            Create Pizza
        </Link>
    </>
};

export default PizzasTab;