import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';

const DeliveryAddressForm = ({ children, onSubmit }) => {

    const [deliveryFormState, setDeliveryFormState] = useState(
        { city: '', postcode: '', address: '', flatCode: '' });

    const [preDefAddressesState, setPreDefAddressesState] = useState(
        { loading: true });

    useEffect(() => {
        const fetch = async () => {
            const uri = '/account/addresses';
            const action = async () => axios.get(uri, { validateStatus: false });
            const addresses = await requestHandler(action);

            setPreDefAddressesState({ loading: false, addresses });
        };
        fetch();
    }, []);

    const predfinedOnChange = event => {
        let predefinedAddress = JSON.parse(event.target.value);
        predefinedAddress.flatCode = predefinedAddress.flatCode ?? '';
        setDeliveryFormState(predefinedAddress);
    };

    const onFormChange = (name, value) => setDeliveryFormState(state => {
        let newState = Object.assign({}, state);
        newState[name] = value;
        return newState;
    });

    if (preDefAddressesState.loading) return <></>
    if (!deliveryFormState) return <></>
    return <>
        <form onSubmit={onSubmit ?? (() => { })}>
            <select className="form-control mb-4" value="default"
                onChange={predfinedOnChange}>

                <option disabled value="default">
                    -- fill with predefined address --
                </option>

                {
                    preDefAddressesState.addresses.map((address, i) =>
                        <option key={`o-${i}`} value={`${JSON.stringify(address)}`}>
                            {address.city}, {address.postcode},&nbsp;
                            {address.address}
                            
                            {
                                address.flatCode && 
                                    ` | flat code: ${address.flatCode}`
                                
                            }
                        </option>
                    )
                }
            </select>

            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" className="form-control"
                    placeholder="City..."
                    onChange={event => onFormChange(event.target.name, event.target.value)}
                    value={deliveryFormState?.city} required />
            </div>

            <div className="form-group">
                <label>Postcode</label>
                <input name="postcode" type="text" className="form-control"
                    placeholder="Postcode..."
                    onChange={event => onFormChange(event.target.name, event.target.value)}
                    value={deliveryFormState?.postcode} required />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input name="address" type="text" className="form-control"
                    placeholder="Address..."
                    onChange={event => onFormChange(event.target.name, event.target.value)}
                    value={deliveryFormState?.address} required />
            </div>

            <div className="form-group">
                <label>Flat Code (optional)</label>
                <input name="flatCode" type="text" className="form-control"
                    placeholder="Flat Code..."
                    onChange={event => onFormChange(event.target.name, event.target.value)}
                    value={deliveryFormState?.flatCode} />
            </div>

            {children}
        </form>
    </>
};

export default DeliveryAddressForm;