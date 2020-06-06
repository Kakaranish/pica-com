import React, { useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

let socket;

const SocketComponent = (props) => {

    useEffect(() => {
        const initSocket = async () => {
            if (!props.identity) return;
            const result = await axios.post('/auth/verify');
            if(!result.data.identity) return;

            socket = io('http://localhost:8000');

            socket.on('joinRes', res => console.log(res));

            socket.on('serverMessage', res => console.log(res));
        }
        initSocket();

    }, [props.identity]);

    return <></>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(SocketComponent);