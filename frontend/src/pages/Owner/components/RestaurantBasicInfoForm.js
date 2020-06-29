import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';
import ReactTooltip from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const RestaurantBasicInfoForm = ({ restaurant, onSubmit = () => { }, children }) => {

    const [state, setState] = useState({ loading: true });
    const [selected, setSelected] = useState([]);
    const [validationErrors, setValidationErrors] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/categories',
                { validateStatus: false });
            const availableCategories = await requestHandler(action);
            const categoryOptions = availableCategories.map(cat =>
                ({ value: cat._id, label: cat.name }));
            setState({ loading: false, categoryOptions: categoryOptions });

            const selectedCategories = !restaurant
                ? []
                : restaurant.categories.map(cat => ({
                    value: cat._id, label: cat.name
                }));
            setSelected(selectedCategories);
        };
        fetch();
    }, []);

    const categoriesOnChange = selectedOptions => setSelected(selectedOptions);

    const handleOnSubmit = async event => {
        if (!selected?.length) {
            event.preventDefault();
            setValidationErrors(["choose at least 1 category"]);
        }
        else await onSubmit(event);
    }

    if (state.loading) return <></>

    return <>
        <form onSubmit={handleOnSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" className="form-control"
                    defaultValue={restaurant?.name}
                    placeholder="Name..." required />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" type="text" className="form-control"
                    defaultValue={restaurant?.description} rows="4"
                    placeholder="Description..." required>
                </textarea>
            </div>

            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" className="form-control"
                    defaultValue={restaurant?.location?.city}
                    placeholder="City..." required />
            </div>

            <div className="form-group">
                <label>Postcode</label>
                <input name="postcode" type="text" className="form-control"
                    defaultValue={restaurant?.location?.postcode}
                    placeholder="Postcode..." required />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input name="address" type="text" className="form-control"
                    defaultValue={restaurant?.location?.address}
                    placeholder="Address..." required />
            </div>

            <div className="form-group">
                <label>Contact number</label>
                <input name="contactNumber" type="text" className="form-control"
                    defaultValue={restaurant?.contactNumber}
                    placeholder="Contact number..." required />
            </div>

            <div className="form-group">
                <label>
                    Pizza categories:&nbsp;
                    <FontAwesomeIcon icon={faQuestionCircle}
                        style={{ color: 'lightgray' }}
                        size={'1x'}
                        data-tip="Pizza types that restaurant offers" />

                </label>
                <input name="categories" value={JSON.stringify(selected?.map(s => s.value)) ?? []} readOnly hidden />
                <Select multi={true} isMulti
                    onChange={categoriesOnChange}
                    options={state.categoryOptions}
                    value={selected}
                />
            </div>

            {children}

            <ReactTooltip />
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

export default RestaurantBasicInfoForm;