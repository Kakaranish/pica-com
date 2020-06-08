import React, { useState } from 'react';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ChangePasswordPage = () => {

    const history = useHistory();
    const [validationErrors, setValidationErrors] = useState(null);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const formErrors = validateFormData(formData);
        if (formErrors.length) {
            setValidationErrors(formErrors);
            return;
        }

        const action = async () => axios.put('/account/password', formData,
            { validateStatus: false });
        const result = await requestHandler(action,
            {
                status: 400,
                callback: async result => setValidationErrors(result.map(e => e.msg))
            });
        if (!result) return;

        alert('Password has been updated');
        history.goBack();
    }

    return <>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Old password</label>
                <input name="oldPassword" type="password"
                    className="form-control" placeholder="Old password..." required />
            </div>

            <div className="form-group">
                <label>New password</label>
                <input name="newPassword" type="password"
                    className="form-control" placeholder="New password..." required />
            </div>

            <div className="form-group">
                <label>Confirmed new password</label>
                <input name="confirmedNewPassword" type="password"
                    className="form-control" placeholder="Confirmed new password..." required />
            </div>

            <button type="submit" className="btn btn-success w-25">
                Change Password
            </button>
        </form>

        {
            validationErrors &&
            <div className="col-12 mt-2">
                <p className="text-danger font-weight-bold" style={{ marginBottom: '0px' }}>
                    Validation errors
                    </p>
                <ul style={{ paddingTop: "0", marginTop: "0px" }}>
                    {
                        validationErrors.map((error, i) => {
                            return <li key={`val-err-${i}`} className="text-danger">
                                {error}
                            </li>
                        })
                    }
                </ul>
            </div>
        }
    </>
};

function validateFormData(formData) {
    const errors = [];
    if (formData.newPassword !== formData.confirmedNewPassword)
        errors.push('new passwords are different');
    if (formData.newPassword.length < 5)
        errors.push('password must have at least 5 characters');
    if (formData.oldPassword === formData.newPassword)
        errors.push('new password cant be same as old password');

    return errors;
}

export default ChangePasswordPage;