import React, { useState } from 'react';

const MinFreeDeliveryInput = ({ defaultValue }) => {

    const [selected, setSelected] = useState(!!defaultValue ?? false);

    return <>
        <div className="form-check">
            <input className="form-check-input"
                id="opt-checkbox"
                type="checkbox"
                checked={selected}
                onChange={() => setSelected(s => !s)} />
            <label className="form-check-label" htmlFor="opt-checkbox">
                Has minimum free delivery price? {selected && '(PLN)'}
            </label>
        </div>

        {
            selected &&
            <input name="minFreeDeliveryPrice"
                type="number"
                className="form-control"
                defaultValue={defaultValue}
                min={0} step={0.01}
                placeholder="Minimum free delivery price..."
                required />
        }
    </>
};

export default MinFreeDeliveryInput;