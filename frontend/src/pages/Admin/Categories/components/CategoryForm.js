import React from 'react';

const CategoryForm = ({ category, onSubmitCb = () => { }, children }) => <>
    <form onSubmit={onSubmitCb}>
        {
            category &&
            <div className="form-group">
                <label>Id</label>
                <input name="name" type="text" className="form-control"
                    defaultValue={category._id} readOnly />
            </div>
        }

        <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" className="form-control"
                placeholder="Name..." defaultValue={category?.name} required />
        </div>

        {children}
        
    </form>
</>

export default CategoryForm;