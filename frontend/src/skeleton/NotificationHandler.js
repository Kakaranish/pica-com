import React, { useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket;

const NotificationHandler = (props) => {

    useEffect(() => {
        const initSocket = async () => {
            if (!props.identity) return;
            const result = await axios.post('/auth/notif-identity');
            if (!result.data) return;

            const query = `notifIdentityToken=${result.data}`;
            socket = io('http://localhost:8000', { query });

            socket.on('notif', ({ id, content, header, createdAt }) => {
                props.addNotif({ id, content, header, createdAt });
                toast('You have new notification', toastOptions);
            });

            socket.on('toastOnlyNotif', content => toast(content, toastOptions));

            socket.on('clearNotifs', () => props.clearNotifs());

            socket.on('removeNotif', ({ notifId }) => props.removeNotif(notifId));
        }
        initSocket();

    }, [props.identity]);

    return <ToastContainer />;
};

const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: false
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(NotificationHandler);