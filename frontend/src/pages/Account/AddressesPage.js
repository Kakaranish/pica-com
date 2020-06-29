import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { requestHandler } from '../../common/utils';

const AddressesPage = () => {

    const history = useHistory();
    const createUri = '/account/create/address';

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
        <h3 className="mb-3">You have already no addresses defined</h3>

        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create new address
            </div>
        </Link>
    </>
    return <>
        <h3 className="mb-3">Your delivery addresses</h3>

        <Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
            <div>
                <FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
            </div>
            <div className="text-decoration-none text-dark">
                Create new address
            </div>
        </Link>

        {
            state.addresses.map((address, i) =>
                <div className="p-3 mb-3 border border-darken-1" key={`a-${i}`}>
                    <div className="mb-2">
                        <b>City: </b> {address.city}<br />
                        <b>Postcode: </b> {address.postcode}<br />
                        <b>Address: </b> {address.address}<br />

                        {
                            address.flatCode &&
                            <>
                                <b>Flat code:</b> {address.flatCode}<br />
                            </>
                        }
                    </div>

                    <Link to={`/account/edit/address/${address._id}`} className="btn btn-primary">
                        Edit
                    </Link>

                    <button className="btn btn-danger ml-2"
                        onClick={async () => onDelete(address._id)}>
                        Delete
                    </button>
                </div>
            )
        }
    </>
};

export default AddressesPage;