import React, { useEffect, useState } from 'react';
import moment from 'moment';

const OrderTimer = ({ order }) => {

    const [counter, setCounter] = useState(null);

    Number.prototype.pad = function (size) {
        var s = String(this);
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }

    useEffect(() => {
        let toCount = moment.duration(moment(order.estimatedDeliveryTime)
            .diff(moment())).asSeconds();
        toCount = toCount >= 0 ? Math.ceil(toCount) : 0;
        
        setCounter(toCount);
    }, []);

    React.useEffect(() => {
        if (!counter) return;
        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return <>
        <h3 className="my-2">
            Estimated Delivery Time {Math.trunc(counter / 60).pad(2)}:{(counter % 60).pad(2)}
        </h3>
    </>
};

export default OrderTimer;