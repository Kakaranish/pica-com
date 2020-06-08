import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { requestHandler } from '../../common/utils';

const AddressesPage = () => {

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/account/addresses',
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, addresses: result });
        };
        fetch();
    }, []);

    if (state.loading) return <></>;
    else if (!state.addresses.length) return <>
        <h3>You have already no addresses defined</h3>

        <Link to='/account/create/address' className="btn btn-success">
            Create
        </Link>
    </>
    return <>
        <h3>Your shipping addresses</h3>

        {
            state.addresses.map((address, i) => <div className="p-3 mb-3"
                style={{ border: "1px solid red" }} key={`a-${i}`}>
                <p>City: {address.city}</p>
                <p>Postcode: {address.postcode}</p>
                <p>Address: {address.address}</p>
                <p>House or flat number: {address.houseOrFlatNumber}</p>
                {
                    address.flatCode &&
                    <p>Flat code: {address.flatCode}</p>
                }
                <p>Is default: {address.isDefault ? 'Yes' : 'No'}</p>
                <Link to={`/account/edit/address/${address._id}`} className="btn btn-primary">
                    Edit
                </Link>
            </div>)
        }

        <Link to='/account/create/address' className="btn btn-success mt-2">
            Create new address
        </Link>
    </>
};

export default AddressesPage;