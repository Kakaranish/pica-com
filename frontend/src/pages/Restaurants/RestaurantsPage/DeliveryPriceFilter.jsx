import React, { useState } from 'react';

const DeliveryPriceFilter = ({ setDeliveryPrice }) => {

    const [selected, setSelected] = useState(null);
    const onSelectionChange = async event => {
        const deliveryPrice = event.target.value
            ? parseInt(event.target.value)
            : null;

        setSelected(deliveryPrice);
        setDeliveryPrice(deliveryPrice);
    }

    return <>
        <h5 style={{ marginTop: "10px" }}>
            Delivery price
        </h5>

        <div className="form-check">
            <input className="form-check-input" type="radio" name="deliveryPrice"
                id="deliveryPriceNull" onChange={onSelectionChange}
                value={null} checked={selected === null} />
            <label className="form-check-label" htmlFor="deliveryPriceNull">
                Does not matter
          </label>
        </div>

        <div className="form-check">
            <input className="form-check-input" type="radio" name="deliveryPrice"
                id="deliveryPrice5" onChange={onSelectionChange}
                value={5} checked={selected === 5} />
            <label className="form-check-label" htmlFor="deliveryPrice5">
                5 PLN or less
            </label>
        </div>

        <div className="form-check">
            <input className="form-check-input" type="radio" name="deliveryPrice"
                id="deliveryPrice10" onChange={onSelectionChange}
                value={10} checked={selected === 10} />
            <label className="form-check-label" htmlFor="deliveryPrice10">
                10 PLN or less
            </label>
        </div>

        <div className="form-check">
            <input className="form-check-input" type="radio" name="deliveryPrice"
                id="deliveryPrice15" onChange={onSelectionChange}
                value={15} checked={selected === 15} />
            <label className="form-check-label" htmlFor="deliveryPrice15">
                15 PLN or less
            </label>
        </div>
    </>
};

export default DeliveryPriceFilter;