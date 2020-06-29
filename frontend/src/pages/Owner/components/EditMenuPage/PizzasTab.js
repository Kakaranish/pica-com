import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PizzaItem from './PizzaItem';

const PizzasTab = ({ restaurantId, pizzas }) => {

    const createUri = `/owner/restaurants/${restaurantId}/create/pizza`;
    if (!pizzas?.length) return <>
        <h3 className="mb-3">No pizzas yet</h3>

        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Pizza
            </div>
        </Link>
    </>

    return <>
        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Pizza
            </div>
        </Link>
        
        {
            pizzas.map((pizza, i) =>
                <div className="p-3 mb-3 border border-darken-1"  key={`p-${i}`}>
                    <PizzaItem pizza={pizza} />
                </div>
            )
        }
    </>
};

export default PizzasTab;