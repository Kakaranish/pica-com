import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const QuantityInput = ({ defaultValue, minValue = -Infinity, maxValue = Infinity,
    onQuantityChange, onUnderMinAttempt = () => { }, classes }) => {

    const [initialized, setInialized] = useState(false);
    const [value, setValue] = useState(defaultValue ?? 1);

    useEffect(() => {
        if (!initialized) setInialized(true);
        else onQuantityChange(value);
    }, [value]);

    const plusOnClick = () => {
        if (value + 1 <= maxValue) setValue(val => val + 1);
    };

    const minusOnClick = () => {
        if (value - 1 >= minValue) setValue(val => val - 1);
        else onUnderMinAttempt()
    };

    return <>
        <div className={`mb-2 ${classes ?? ''}`} style={{ display: 'flex' }}>
            <div>
                <FontAwesomeIcon icon={faMinusCircle}
                    size={'lg'}
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => minusOnClick()} />
            </div>

            <div className="text-center" style={{ width: '30px' }}>
                <b unselectable="on">
                    {value}
                </b>
            </div>

            <div>
                <FontAwesomeIcon icon={faPlusCircle}
                    size={'lg'}
                    style={{ color: 'green', cursor: 'pointer' }}
                    onClick={() => plusOnClick()} />
            </div>
        </div>
    </>
};

export default QuantityInput;