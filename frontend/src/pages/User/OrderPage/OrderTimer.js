import React, { useEffect, useState } from 'react';
import moment from 'moment';
import AwareComponentBuilder from '../../../common/AwareComponentBuilder';
import { useHistory } from 'react-router-dom';

const OrderTimer = (props) => {

    const { order } = props;
    const history = useHistory();

    const [initialized, setInitialized] = useState(false);
    const [counter, setCounter] = useState(null);

    useEffect(() => {
        if(!initialized) {
            setInitialized(true);
            return;
        }
        history.push('/refresh');
    }, [props.notifs]);
    
    useEffect(() => {
        if (!counter) setCounter(getSecondsToCount());
        const timer =
            counter > 0 && setInterval(() => setCounter(getSecondsToCount()), 1000);
        return () => clearInterval(timer);
    }, [counter]);
    
    const getSecondsToCount = () => Math.ceil(moment.duration(
        moment(order.estimatedDeliveryTime).diff(moment())).asSeconds());

    return <>
        <h3 className="my-2">
            Estimated Delivery Time&nbsp;
            {Math.trunc(counter / 60).pad(2)}:{(counter % 60).pad(2)}
        </h3>
    </>
};

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};

export default new AwareComponentBuilder()
    .withNotifsAwareness()
    .build(OrderTimer);