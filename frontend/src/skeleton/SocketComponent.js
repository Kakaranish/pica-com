import React, { useEffect } from 'react';
import io from 'socket.io-client';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

let socket;

const SocketComponent = (props) => {

    useEffect(() => {
        if (!props.identity) return;

        socket = io('http://localhost:9000');
        socket.emit('join', { email: props.identity.email });

        socket.on('joinRes', res => console.log(res));
        
        socket.on('serverMessage', res => console.log(res));

    }, [props.identity]);

    return <></>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(SocketComponent);