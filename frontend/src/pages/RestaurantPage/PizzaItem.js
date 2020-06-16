import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import QuantityInput from './QuantityInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

const PizzaItem = ({ pizza, extraIngredients, addToCartCb }) => {

    const ingredientsOptions = extraIngredients.map(extra => ({
        value: JSON.stringify(extra),
        label: `${extra.name} (${extra.price.toFixed(2)} PLN)`
    }));

    const [isFocused, setIsFocused] = useState(false);
    const [selected, setSelected] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => { if (!isFocused) setSelected([]) }, [isFocused]);

    const extraIngredientsOnChange = selectedOptions => setSelected(selectedOptions);
    const onQuantityChange = newQuantity => setQuantity(newQuantity);

    const addToCartOnClick = () => {
        const cartItem = {
            pizza: pizza,
            extraIngredients: selected
                ? selected.map(s => JSON.parse(s.value))
                : [],
            quantity: quantity
        };
        addToCartCb(cartItem);

        setSelected([]);
        setIsFocused(false);
    };

    if (!isFocused) return <div style={{ cursor: 'pointer' }}
        onClick={() => setIsFocused(focused => !focused)}>
        <div className="pull-right">
            <FontAwesomeIcon icon={faPlus}
                size={'1x'} />
        </div>

        <p>
            <b>{pizza.name} </b>
            ({pizza.price.toFixed(2)} PLN)
        </p>

        <p>
            {pizza.description}
        </p>
    </div>

    const calculateCost = () => {
        const ingredients = (selected ?? []).map(s => JSON.parse(s.value));
        const ingredientsPrice = ingredients.map(i => i.price)
            .reduce((l, r) => l + r, 0);
        return pizza.price + ingredientsPrice;
    }

    return <>
        <div className="pull-right">
            <FontAwesomeIcon icon={faTimes}
                size={'1x'}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsFocused(focused => !focused)} />
        </div>

        <p>
            <b>{pizza.name} </b>
        </p>

        <p>
            {pizza.description}
        </p>

        {
            extraIngredients &&
            <div className="form-group">
                <label>Extra ingredients (optional):</label>
                <input name="categories"
                    readOnly
                    hidden />

                <Select multi={true} isMulti
                    onChange={extraIngredientsOnChange}
                    options={ingredientsOptions}
                    value={selected}
                />
            </div>
        }

        <QuantityInput minValue={1} onQuantityChange={onQuantityChange}/>

        <button className="btn btn-primary btn-block"
            onClick={addToCartOnClick}>
            Add to cart ({calculateCost().toFixed(2)} PLN)
        </button>
    </>
};

export default PizzaItem;