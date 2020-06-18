import React from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const PayPage = ({ match }) => {

    const orderId = match.params.id;
    const history = useHistory();

    const onFinalize = async () => {
        toast('Voilà! Wait for your food :)');
        history.push(`/user/orders/${orderId}`);
    };

    return <>
        <h2 className="text-danger">
            This is mock page
        </h2>

        <p>
            Here you'd be redirected to payment provider - Blik/PayU
        </p>

        <p>Click 'Finalize order' button to simulate situation you've just
            paid for your order</p>

        <button className="btn btn-primary" onClick={onFinalize}>
            Finalize Order
        </button>
    </>
};

export default PayPage;