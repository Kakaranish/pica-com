import React, { useState } from 'react';
import CategoryForm from './CategoryForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CategoryItem = ({ category }) => {

    const history = useHistory();

    const [inEditMode, setInEditMode] = useState(false);
    const [categoryState, setCategoryState] = useState(Object.assign({}, category));

    const onUpdateCb = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const uri = `/admin/categories/${category._id}`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action);

        setCategoryState(catState => Object.assign(formData, { _id: catState._id }));
        setInEditMode(false);
    };

    const onDelete = async () => {
        if (window.confirm("Do you really want to delete this category?")) {
            const uri = `/admin/categories/${categoryState._id}`;
            const action = async () => axios.delete(uri, { validateStatus: false });
            await requestHandler(action, {
                status: 200,
                callback: async () => history.go()
            });
        }
    };

    if (!inEditMode) return <>
        <p>
            <b>Name: </b> {categoryState.name}
        </p>

        <button className="btn btn-primary mr-2" onClick={() => setInEditMode(true)}>
            Edit
        </button>

        <button className="btn btn-danger" onClick={onDelete}>
            Delete
        </button>
    </>

    return <>
        <CategoryForm category={categoryState} onSubmitCb={onUpdateCb}>
            <button type="submit" className="btn btn-primary mr-2">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </CategoryForm>
    </>
};

export default CategoryItem;