import React from 'react';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

const NotificationIndicator = (props) => {
    if(!props.notifs?.length) return <p>No notifications</p>
    return <>
        {props.notifs.length} notification(s) to read
    </>
};

export default new AwareComponentBuilder()
    .withNotifsAwareness()
    .build(NotificationIndicator);