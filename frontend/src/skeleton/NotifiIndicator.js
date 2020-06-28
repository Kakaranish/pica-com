import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { requestHandler } from '../common/utils';

const NotifIndicator = (props) => {

    const wrapperRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => () =>
        document.removeEventListener("click", handleClickOutside, false), []);

    const handleClickOutside = async event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsExpanded(isExpanded => !isExpanded);
            document.removeEventListener("click", handleClickOutside, false);

            const action = async () => axios.delete('/notifications', {},
                { validateStatus: false });
            await requestHandler(action);
            props.clearNotifs();
        }
    };

    const notifIconClick = () => {
        if (!isExpanded) {
            setIsExpanded(!isExpanded)
            document.addEventListener("click", handleClickOutside, false);
        }
    }

    if (!props.notifs?.length)
        return <FontAwesomeIcon icon={faBell} size={'2x'} />
    else return <>
        <div className={`btn-group ${isExpanded && 'show'}`} >

            <div onClick={notifIconClick} aria-haspopup="true"
                aria-expanded={isExpanded}>
                <FontAwesomeIcon icon={faBell} size={'2x'}  />
            </div>

            <span className="badge badge-danger" style={{height: "20px"}}>
                {props.notifs.length}
            </span>

            <div ref={wrapperRef} className={`dropdown-menu dropdown-menu-right ${isExpanded && 'show'}`}
                style={{ minWidth: "30vw" }}>
                {
                    props.notifs.map((notif, i) => <div className="py-2 px-4" key={`notif-${i}`}>
                        <p style={{ color: "gray" }}>
                            {moment(notif.createdAt).format("HH:mm YYYY-MM-DD")}
                        </p>
                        {notif.content}

                        {
                            (i + 1 != props.notifs.length) &&
                            <div className="dropdown-divider"></div>
                        }
                    </div>)
                }
            </div>
        </div>
    </>
};

export default new AwareComponentBuilder()
    .withNotifsAwareness()
    .build(NotifIndicator);