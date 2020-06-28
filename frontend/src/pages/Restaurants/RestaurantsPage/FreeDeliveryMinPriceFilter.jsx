import React, { useState } from 'react';

const FreeDeliveryMinPriceFilter = ({ setMinFreeDeliveryPrice }) => {
  const [selected, setSelected] = useState(null);
  const onSelectionChange = async event => {
    const deliveryPrice = event.target.value
      ? parseInt(event.target.value)
      : null;

    setSelected(deliveryPrice);
    setMinFreeDeliveryPrice(deliveryPrice);
  }

  return <>
    <h5 className="mb-3">
      Minimum free delivery price
    </h5>

    <div className="form-check">
      <input className="form-check-input" type="radio" name="minFreeDeliveryPrice"
        id="minFreeDeliveryPriceNull" onChange={onSelectionChange}
        value={null} checked={selected === null} />
      <label className="form-check-label" htmlFor="minFreeDeliveryPriceNull">
        Does not matter
      </label>
    </div>

    <div className="form-check">
      <input className="form-check-input" type="radio" name="minFreeDeliveryPrice"
        id="minFreeDeliveryPrice25" onChange={onSelectionChange}
        value={25} checked={selected === 25} />
      <label className="form-check-label" htmlFor="minFreeDeliveryPrice25">
        25 PLN or less
      </label>
    </div>

    <div className="form-check">
      <input className="form-check-input" type="radio" name="minFreeDeliveryPrice"
        id="minFreeDeliveryPrice50" onChange={onSelectionChange}
        value={50} checked={selected === 50} />
      <label className="form-check-label" htmlFor="minFreeDeliveryPrice50">
        50 PLN or less
      </label>
    </div>
  </>

};

export default FreeDeliveryMinPriceFilter;