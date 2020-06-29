import React from 'react';
import HyperModal from 'react-hyper-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import smileIcon from '../assets/img/smile.svg';
import logoutIcon from '../assets/img/logout.svg';
import kitchenIcon from '../assets/img/kitchen.svg';
import squaresIcon from '../assets/img/squares.svg';
import receiptIcon from '../assets/img/receipt.svg';
import usersIcon from '../assets/img/users.svg';
import sadIcon from '../assets/img/sad.svg';
import './style.css';
import { requestHandler } from '../common/utils';
import axios from 'axios';

const ModalMenu = (props) => {

    const onLogout = async () => {
        await requestHandler(async () => axios.post('/auth/logout'));
        props.unsetIdentity();
        props.clearNotifs();
        props.clearAllCarts();
        window.location.reload();
    };

    const renderOpenButton = requestOpen => <>
        <div className="mr-2" style={{ cursor: 'pointer' }} onClick={requestOpen}>
            <FontAwesomeIcon icon={faBars} size={'2x'} />
        </div>
    </>

    const renderNotLoggedIn = () => <>

        <div className="px-4 py-5 d-flex align-items-center" style={{ background: "lightgray" }}>
            <img src={sadIcon} className="my-3" style={{ height: "10vh" }} />

            <div className="ml-4">
                <h3>Do you see this emoticon?</h3>
                <a href='/auth/login'>
                    Log In&nbsp;
                </a>

                to make it smiled... and make orders
                <br />
                ...or if you have no account then&nbsp;
                <a href="/auth/register">register</a>
            </div>
        </div>
    </>

    const renderLoggedIn = () => <>

        <div className="p-4 d-flex align-items-center" style={{ background: "lightgray" }}>
            <img src={smileIcon} className="my-3" style={{ height: "10vh" }} />

            <div className="ml-4">
                <h3 className="mb-0">
                    {props.identity.firstName} {props.identity.lastName}
                </h3>
                {props.identity.email}

                <br />
                <a href='/account'>
                    Manage your account
                </a>
            </div>
        </div>

        <div className="mt-2 p-4">
            <ul className="list-group">
                {
                    props.identity.role === 'USER' &&
                    <a href='/user/orders' className="text-decoration-none text-body">
                        <li className="list-group-item d-flex align-items-center"
                            style={{ cursor: "pointer" }}>
                            <img src={receiptIcon} className="mr-3" style={{ height: "30px" }} />
                            <div>Go to your orders</div>
                        </li>
                    </a>
                }

                {
                    props.identity.role === 'OWNER' && <>
                        <a href='/owner/restaurants' className="text-decoration-none text-body">
                            <li className="list-group-item d-flex align-items-center"
                                style={{ cursor: "pointer" }}>
                                <img src={kitchenIcon} className="mr-3" style={{ height: "30px" }} />
                                <div>Manage restaurants</div>
                            </li>
                        </a>

                        <a href='/owner/orders' className="text-decoration-none text-body">
                            <li className="list-group-item d-flex align-items-center"
                                style={{ cursor: "pointer" }}>
                                <img src={receiptIcon} className="mr-3" style={{ height: "30px" }} />
                                <div>Manage orders</div>
                            </li>
                        </a>
                    </>
                }

                {
                    props.identity.role === 'ADMIN' && <>
                        <a href='/admin/manage/restaurants' className="text-decoration-none text-body">
                            <li className="list-group-item d-flex align-items-center"
                                style={{ cursor: "pointer" }}>
                                <img src={kitchenIcon} className="mr-3" style={{ height: "30px" }} />
                                <div>Manage restaurants</div>
                            </li>
                        </a>

                        <a href='/admin/manage/users' className="text-decoration-none text-body">
                            <li className="list-group-item d-flex align-items-center"
                                style={{ cursor: "pointer" }}>
                                <img src={usersIcon} className="mr-3" style={{ height: "30px" }} />
                                <div>Manage users</div>
                            </li>
                        </a>

                        <a href='/admin/manage/categories' className="text-decoration-none text-body">
                            <li className="list-group-item d-flex align-items-center"
                                style={{ cursor: "pointer" }}>
                                <img src={squaresIcon} className="mr-3" style={{ height: "30px" }} />
                                <div>Manage categories</div>
                            </li>
                        </a>
                    </>
                }

                <li className="list-group-item d-flex align-items-center"
                    style={{ cursor: "pointer" }} onClick={onLogout}>
                    <img src={logoutIcon} className="mr-3" style={{ height: "30px" }} />
                    <div>Log out</div>
                </li>
            </ul>
        </div>

    </>

    return <>
        <HyperModal renderOpenButton={requestOpen => renderOpenButton(requestOpen)}
            classes={{ contentClassName: "h-75 w-50", wrapperClassName: "top-layer" }}>
            {
                props.identity
                    ? renderLoggedIn()
                    : renderNotLoggedIn()
            }

        </HyperModal>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .withCartsAwareness()
    .build(ModalMenu);