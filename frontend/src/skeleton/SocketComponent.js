import React, { useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket;

const SocketComponent = (props) => {

    useEffect(() => {
        const initSocket = async () => {
            if (!props.identity) return;
            const result = await axios.post('/auth/verify');
            if (!result.data.identity) return;

            socket = io('http://localhost:8000');

            socket.on('notif', ({ content, createdAt }) => {
                props.addNotif({ content, createdAt });

                toast('You have new notification', {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: false
                });
            });

            socket.on('toastOnlyNotif',  content => {
                toast(content, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    pauseOnHover: false
                });
            });

            socket.on('clearNotifs', () => props.clearNotifs());

            socket.on('removeNotif', ({ notifId }) => props.removeNotif(notifId));
        }
        initSocket();

    }, [props.identity]);

    return <>
        <ToastContainer />
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(SocketComponent);