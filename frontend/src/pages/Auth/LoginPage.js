import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import googleIcon from '../../assets/img/google.svg';
import facebookIcon from '../../assets/img/facebook.svg';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const LoginPage = (props) => {

    const history = useHistory();

    const [validationErrors, setValidationErrors] = useState(null);

    const logWithGoogleOnClick = () =>
        window.location = 'http://localhost:9000/auth/provider/google';

    const logWithFacebookOnClick = () =>
        window.location = 'http://localhost:9000/auth/provider/facebook';

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const loginAction = async () => axios.post('/auth/login', formData,
            { validateStatus: false });
        const loginResult = await requestHandler(loginAction, {
            status: 400,
            callback: async result =>
                setValidationErrors(result.errors.map(m => m.msg))
        });
        if (!loginResult) return;

        const fetchNotifsAction = async () => axios.get('/notifications',
            { validateStatus: false });
        const fetchNotifsResult = await requestHandler(fetchNotifsAction);
        if(!fetchNotifsResult) return;

        props.setIdentity(loginResult);
        props.setNotifs(fetchNotifsResult);

        setValidationErrors(null);
        history.push('/');
    };

    return <>
        <h5>Log in using credentials</h5>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <input name="email" type="email" className="form-control" id="emailInput" placeholder="Email..." required />
            </div>
            <div className="form-group">
                <input name="password" type="password" className="form-control" id="passwordInput" placeholder="Password..." required />
            </div>

            <button type="submit" className="btn btn-primary">
                Log In
            </button>

            {
                validationErrors &&
                <div className="col-12 mt-2">
                    <p className="text-danger font-weight-bold" style={{ marginBottom: '0px' }}>
                        Validation errors
                </p>
                    <ul style={{ paddingTop: "0", marginTop: "0px" }}>
                        {
                            validationErrors.map((error, i) => {
                                return <li key={`val-err-${i}`} className="text-danger">{error}</li>
                            })
                        }
                    </ul>
                </div>
            }
        </form>

        <div className="p-2 mt-3">
            <h5>Or use social providers</h5>

            <img src={googleIcon} className="pr-2" style={{ width: "35px", cursor: "pointer" }} onClick={logWithGoogleOnClick} />

            <img src={facebookIcon} style={{ width: "25px", cursor: "pointer" }} onClick={logWithFacebookOnClick} />
        </div>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(LoginPage);