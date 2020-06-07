import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddressesPage = () => {

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {

            const result = await axios.get('/account/addresses',
                { validateStatus: false });
            if (result.status !== 200) {
                alert('Error occured');
                console.log(result);
                setState({ loading: false });
                return;
            }
            setState({ loading: false, addresses: result.data });
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
                <p>Postcode: {address.postocde}</p>
                <p>Address: {address.address}</p>
                <p>House or flat number: {address.houseOrFlatNumber}</p>
                <p>Flat code: {address.flatCode}</p>
                <p>Is default: {address.isDefault ? 'Yes' : 'No'}</p>
                <Link className="btn btn-primary" to='/'>
                    Edit
                </Link>
            </div>)
        }

        <Link to='/account/edit/address/:id' className="btn btn-success mt-2">
            Create new address
        </Link>
    </>
};

export default AddressesPage;