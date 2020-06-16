import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const QuantityInput = ({ defaultValue, minValue = -Infinity, maxValue = Infinity,
    onQuantityChange }) => {

    const [value, setValue] = useState(defaultValue ?? 1);
    useEffect(() => onQuantityChange(value), [value]);
    const plusOnClick = () => {
        if (value + 1 <= maxValue) setValue(val => val + 1);
    };

    const minusOnClick = () => {
        if (value - 1 >= minValue) setValue(val => val - 1);
    };

    return <>
        <div className="form-inline">
            <FontAwesomeIcon icon={faMinusCircle}
                size={'lg'}
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => minusOnClick()} />

            <div className="text-center" style={{ width: '30px' }}>
                <b unselectable="on">
                    {value}
                </b>
            </div>

            <FontAwesomeIcon icon={faPlusCircle}
                size={'lg'}
                style={{ color: 'green', cursor: 'pointer' }}
                onClick={() => plusOnClick()} />
        </div>
    </>
};

export default QuantityInput;