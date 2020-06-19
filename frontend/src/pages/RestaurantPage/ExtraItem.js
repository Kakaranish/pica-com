import React, { useState } from 'react';
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import QuantityInput from './QuantityInput';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const ExtraItem = (props) => {

    const { extra, addToCartCb } = props;

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

    const iconOnClick = () => {
        if (!props.identity) {
            return;
        }
        setIsFocused(focused => !focused);
    };

    const calculateCost = () => extra.price * quantity;

    if (!isFocused) return <div style={{ cursor: 'pointer' }}
        onClick={iconOnClick}>

        <div className="pull-right" data-tip="Log in to make order">
            <FontAwesomeIcon icon={faPlus} size={'1x'} />
        </div>

        <p>
            <b>{extra.name} </b>
            ({extra.price.toFixed(2)} PLN)
        </p>

        {!props.identity && <ReactTooltip />}
    </div>

    return <>
        <div className="pull-right" >
            <FontAwesomeIcon icon={faTimes}
                size={'1x'}
                style={{ cursor: 'pointer' }}
                onClick={iconOnClick} />
        </div>

        <p>
            <b>{extra.name} </b>
            ({extra.price.toFixed(2)} PLN)
        </p>

        <QuantityInput minValue={1} onQuantityChange={onQuantityChange} />

        <button className="btn btn-primary btn-block mt-2"
            onClick={addToCartOnClick}>
            Add to cart ({calculateCost().toFixed(2)} PLN)
        </button>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(ExtraItem);