import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';
import googleIcon from '../../assets/img/google.svg';
import facebookIcon from '../../assets/img/facebook.svg';

const RegisterPage = (props) => {

    const history = useHistory();

    const [validationErrors, setValidationErrors] = useState(null);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const passwordValidation = validateFormPasswords(formData);
        if (passwordValidation.length) {
            setValidationErrors(passwordValidation);
            return;
        }

        const action = async () => axios.post('/auth/register', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async result => {
                props.setIdentity(result);
                setValidationErrors(null);
                history.push('/');
            }
        }, {
            status: 400,
            callback: async result =>
                setValidationErrors(result.errors.map(e => e.msg ?? e))
        });
    };

    const backendBaseUri = process.env.NODE_ENV === 'production'
        ? 'https://pica-com-backend.azurewebsites.net'
        : 'http://localhost:9000';

    const logWithGoogleOnClick = () =>
        window.location = `${backendBaseUri}/auth/provider/google`;

    const logWithFacebookOnClick = () =>
        window.location = `${backendBaseUri}/auth/provider/facebook`;

    return <>
        <h3 className="mb-3">Register</h3>

        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" className="form-control"
                    placeholder="Email..." required />
            </div>
            <div className="form-group">
                <label>First Name</label>
                <input name="firstName" type="text" className="form-control"
                    placeholder="First name..." required />
            </div>
            <div className="form-group">
                <label>Last Name</label>
                <input name="lastName" type="text" className="form-control"
                    placeholder="Last name..." required />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" className="form-control"
                    placeholder="Password..." required />
            </div>

            <div className="form-group">
                <label>Repeat Password</label>
                <input name="repeatPassword" type="password" className="form-control"
                    placeholder="Repeat password..." required />
            </div>

            <button type="submit" className="btn btn-primary">
                Register
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

function validateFormPasswords(formData) {
    const errors = [];
    if (formData.password !== formData.repeatPassword)
        errors.push('passwords are different');
    if (formData.password.length < 5)
        errors.push('password must have at least 5 characters');
    return errors;
}

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(RegisterPage);