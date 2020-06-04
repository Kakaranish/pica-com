import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getFormDataJsonFromEvent } from '../../common/utils';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const RegisterPage = (props) => {

    const history = useHistory();

    const [validationErrors, setValidationErrors] = useState(null);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        if (formData.password !== formData.repeatPassword) {
            setValidationErrors(["passwords are different"])
            return;
        }

        const result = await axios.post('/auth/register', formData, { validateStatus: false });
        if (result.status === 500) {
            alert('Internal error');
            return;
        }

        if (result.data.errors?.length > 0) {
            setValidationErrors(result.data.errors.map(e => e.msg ?? e));
            return;
        }

        props.setIdentity({
            email: result.data.email,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            role: result.data.role,
        });

        setValidationErrors(null);
        history.push('/');
    }

    return <>
        <h3>Sign In</h3>
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
                Submit
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
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(RegisterPage);