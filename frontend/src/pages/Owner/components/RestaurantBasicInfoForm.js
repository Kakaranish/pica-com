import React from 'react';

const RestaurantBasicInfoForm = ({ restaurant, onSubmit = () => { }, children }) => {
    return <>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" className="form-control"
                    defaultValue={restaurant?.name}
                    placeholder="Name..." required />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" type="text" className="form-control"
                    defaultValue={restaurant?.description} rows="4"
                    placeholder="Description..." required>
                </textarea>
            </div>

            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" className="form-control"
                    defaultValue={restaurant?.location?.city}
                    placeholder="City..." required />
            </div>

            <div className="form-group">
                <label>Postcode</label>
                <input name="postcode" type="text" className="form-control"
                    defaultValue={restaurant?.location?.postcode}
                    placeholder="Postcode..." required />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input name="address" type="text" className="form-control"
                    defaultValue={restaurant?.location?.address}
                    placeholder="Address..." required />
            </div>

            <div className="form-group">
                <label>Contact number</label>
                <input name="contactNumber" type="text" className="form-control"
                    defaultValue={restaurant?.contactNumber}
                    placeholder="Contact number..." required />
            </div>

            {children}

        </form>
    </>
};

export default RestaurantBasicInfoForm;