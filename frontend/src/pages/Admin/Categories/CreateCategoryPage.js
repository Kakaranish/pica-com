import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CategoryForm from './components/CategoryForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../common/utils';

const CreateCategoryPage = () => {

    const history = useHistory();
    const [validationErrors, setValidationErrors] = useState(null);

    const onSubmitCb = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const action = async () => axios.post('/admin/categories', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => history.goBack()
        }, {
            status: 400,
            callback: async res => setValidationErrors(res.map(e => e.msg))
        });
    };

    return <>
        <CategoryForm onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-primary">
                Create
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
                                return <li key={`val-err-${i}`} className="text-danger">
                                    {error}
                                </li>
                            })
                        }
                    </ul>
                </div>
            }
        </CategoryForm>
    </>
};

export default CreateCategoryPage;