import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { requestHandler } from '../../common/utils';
import { toast } from 'react-toastify';

const AddressesPage = () => {

    const history = useHistory();

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

    const onDelete = async addressId => {
        if (!window.confirm('Are you sure?')) return;

        const uri = `/account/address/${addressId}`;
        const action = async () => axios.delete(uri, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Address deleted');
                history.push('/refresh');
            }
        });
    };

    if (state.loading) return <></>;
    else if (!state.addresses.length) return <>
        <h3>You have already no addresses defined</h3>

        <Link to='/account/create/address' className="btn btn-success">
            Create
        </Link>
    </>
    return <>
        <h3>Your delivery addresses</h3>

        {
            state.addresses.map((address, i) => <>
                <div className="p-3 mb-3 border border-darken-1" key={`a-${i}`}>
                    <p>City: {address.city}</p>
                    <p>Postcode: {address.postcode}</p>
                    <p>Address: {address.address}</p>
                    
                    {
                        address.flatCode &&
                        <p>Flat code: {address.flatCode}</p>
                    }
                    
                    <Link to={`/account/edit/address/${address._id}`} className="btn btn-primary">
                        Edit
                    </Link>

                    <button className="btn btn-danger ml-2"
                        onClick={async () => onDelete(address._id)}>
                        Delete
                    </button>
                </div>

            </>)
        }

        <Link to='/account/create/address' className="btn btn-success mt-2">
            Create new address
        </Link>
    </>
};

export default AddressesPage;