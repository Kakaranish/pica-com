import React from 'react';
import { Link } from 'react-router-dom';
import ExtraIngredientItem from './ExtraIngredientItem';

const ExtraIngredientsTab = ({ restaurantId, extraIngredients }) => {

    const createUri = `/owner/restaurants/${restaurantId}/create/owner/extra-ingredient`;
    if (!extraIngredients?.length) return <>
        <h3>No extra ingredients to pizza yet</h3>

        <Link to={createUri} className="btn btn-success">
            Create Extra Ingredient
        </Link>
    </>

    return <>
        {
            extraIngredients.map((ingredient, i) =>
                <div className="p-3 mb-3" style={{ border: '1px solid blue' }} key={`p-${i}`}>
                    <ExtraIngredientItem extraIngredient={ingredient} />
                </div>
            )
        }

        <Link to={createUri} className="btn btn-success">
            Create Extra Ingredient
        </Link>
    </>
};

export default ExtraIngredientsTab;