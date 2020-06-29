import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ExtraIngredientItem from './ExtraIngredientItem';

const ExtraIngredientsTab = ({ restaurantId, extraIngredients }) => {

    const createUri = `/owner/restaurants/${restaurantId}/create/extra-ingredient`;
    if (!extraIngredients?.length) return <>
        <h3 className="mb-3">No pizza extra ingredients yet</h3>

        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'}
                    style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Pizza Extra Ingredient
            </div>
        </Link>
    </>

    return <>
        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'}
                    style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create Pizza Extra Ingredient
            </div>
        </Link>

        {
            extraIngredients.map((ingredient, i) =>
                <div className="p-3 mb-3 border border-darken-1" key={`p-${i}`}>
                    <ExtraIngredientItem extraIngredient={ingredient} />
                </div>
            )
        }
    </>
};

export default ExtraIngredientsTab;