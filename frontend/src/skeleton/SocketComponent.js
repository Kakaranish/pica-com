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

            socket.on('notif', ({ content, createdAt, _id }) => {
                props.addNotif({content, createdAt});
                toast(content, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });

            socket.on('clearNotifs', () => props.clearNotifs());
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