import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bsonObjectId from 'bson-objectid';
import { useHistory, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { requestHandler } from '../../common/utils';

const OrderPaymentPage = ({ match }) => {

    const orderId = match.params.id;
    const paymentMethods = [
        { code: 'ON_DELIVERY', label: 'Cash on delivery' },
        { code: 'BLIK', label: 'Blik' },
        { code: 'PAYU', label: 'PayU' },
    ];
    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    const [paymentMethod, setPaymentMethod] = useState('default');

    useEffect(() => {
        const fetch = async () => {
            const uri = `/orders/${orderId}`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const order = await requestHandler(action);
            setState({ loading: false, isAccessible: order && !order.payment });
        };
        fetch();
    }, []);

    const onPay = async () => {

        const formData = {
            method: paymentMethod,
            transactionId: bsonObjectId.generate().toString()
        };

        const action = async () => axios.put(`/orders/${orderId}/payment`,
            formData, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => history.push(`/user/orders/${orderId}/pay`)
        });
    };

    const onFinalize = async () => {
        const action = async () => axios.put(`/orders/${orderId}/payment`,
            { method: paymentMethod }, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Voilà! Wait for your food :)');
                history.push(`/user/orders/${orderId}`);
            }
        });
    };

    if (state.loading) return <></>;
    else if (!state.isAccessible) return <Redirect to='/error/404' />

    return <>
        <h3>Choose payment method</h3>

        <select className="form-control mb-3" value={paymentMethod}
            onChange={event => setPaymentMethod(event.target.value)}>

            <option disabled value="default">-----------------</option>

            {
                paymentMethods.map((method, i) =>
                    <option key={`o-${i}`} value={method.code}>
                        {method.label}
                    </option>)
            }
        </select>

        {
            paymentMethod !== 'default' && <>
                {
                    paymentMethod === 'ON_DELIVERY'
                        ? <>
                            <button className="btn btn-primary" onClick={onFinalize}>
                                Finalize order
                            </button>
                        </>
                        : <>
                            <button className="btn btn-primary" onClick={onPay}>
                                Pay
                            </button>
                        </>
                }
            </>
        }
    </>
};

export default OrderPaymentPage;