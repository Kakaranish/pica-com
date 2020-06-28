import React from 'react';
import logoIcon from '../assets/img/logo.svg';
import NotifIndicator from './NotifiIndicator';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import ModalMenu from './ModalMenu';

const Navbar = (props) => <>
    <nav class="navbar navbar-light bg-light justify-content-between">
        <a href='/' style={{ textDecoration: 'none' }}>
            <div class="navbar-brand d-flex align-items-center ml-2">
                <div>
                    <img src={logoIcon} style={{ height: "30px" }} />
                </div>
                <div className="ml-2">
                    Pica.com
                </div>
            </div>
        </a>

        <form class="form-inline">
            {
                props.identity &&
                <div className="mr-3" style={{ cursor: 'pointer' }}>
                    <NotifIndicator />
                </div>
            }

            <ModalMenu />
            
        </form>
    </nav>
</>

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(Navbar);