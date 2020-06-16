import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import QuantityInput from './QuantityInput';

const ExtraItem = ({ extra, addToCartCb }) => {

    const [isFocused, setIsFocused] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const onQuantityChange = newQuantity => setQuantity(newQuantity);

    const addToCartOnClick = () => {
        const cartItem = {
            extra: extra,
            quantity: quantity
        };
        addToCartCb(cartItem);

        setIsFocused(false);
    };

    const calculateCost = () => extra.price * quantity;

    if (!isFocused) return <div style={{ cursor: 'pointer' }}
        onClick={() => setIsFocused(focused => !focused)}>

        <div className="pull-right">
            <FontAwesomeIcon icon={faPlus}
                size={'1x'} />
        </div>

        <p>
            <b>{extra.name} </b>
            ({extra.price.toFixed(2)} PLN)
        </p>
    </div>

    return <>
        <div className="pull-right">
            <FontAwesomeIcon icon={faTimes}
                size={'1x'}
                style={{ cursor: 'pointer' }}
                onClick={() => setIsFocused(focused => !focused)} />
        </div>

        <p>
            <b>{extra.name} </b>
        </p>

        <QuantityInput minValue={1} onQuantityChange={onQuantityChange} />

        <button className="btn btn-primary btn-block mt-2"
            onClick={addToCartOnClick}>
            Add to cart ({calculateCost().toFixed(2)} PLN)
        </button>
    </>
};

export default ExtraItem;