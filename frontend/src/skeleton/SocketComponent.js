import React, { useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

let socket;

const SocketComponent = (props) => {

    useEffect(() => {
        const initSocket = async () => {
            if (!props.identity) return;
            const result = await axios.post('/auth/verify');
            if (!result.data.identity) return;

            socket = io('http://localhost:8000');

            socket.on('notif', ({ content, createdAt, _id }) => {
                props.addNotif(_id);
            });

            socket.on('clearNotifs', () => props.clearNotifs());
        }
        initSocket();

    }, [props.identity]);

    return <></>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(SocketComponent);