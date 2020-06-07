import React from 'react';

const AddressForm = ({ address, onSubmitCb }) => {

    const onSubmit = async event => onSubmitCb(event);

    return <>
        <form onSubmit={onSubmit}>

            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" className="form-control" placeholder="City..."
                    defaultValue={address?.city} required />
            </div>

            <div className="form-group">
                <label>Postcode</label>
                <input name="postcode" type="text" className="form-control" placeholder="Postcode..."
                    defaultValue={address?.postcode} required />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input name="address" type="text" className="form-control" placeholder="Address..."
                    defaultValue={address?.address} required />
            </div>

            <div className="form-group">
                <label>House or flat number</label>
                <input name="houseOrFlatNumber" type="text" className="form-control" placeholder="House or flat number..."
                    defaultValue={address?.houseOrFlatNumber} />
            </div>

            <div className="form-group">
                <label>Flat Code (optional)</label>
                <input name="flatCode" type="text" className="form-control" placeholder="Flat Code..."
                    defaultValue={address?.flatCode} />
            </div>

            <div className="form-check">
                <input type="checkbox" className="form-check-input" name="isDefault" defaultChecked />
                <label className="form-check-label">
                    Is default address?
                </label>
            </div>

            <button type="submit" className="btn btn-success w-25">
                Submit
            </button>

        </form>
    </>
};

export default AddressForm;