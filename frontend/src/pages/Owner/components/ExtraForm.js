import React from 'react';

const ExtraForm = ({ extra,  onSubmitCb = () => { }, children }) => <>
    <form onSubmit={onSubmitCb}>
        <div className="form-group">
            <label>Name</label>
            <input name="name" type="text" className="form-control"
                placeholder="Name..." defaultValue={extra?.name} required />
        </div>

        <div className="form-group">
            <label>Price (PLN)</label>
            <input name="price" type="number" className="form-control"
                min={0} step={0.01} placeholder="Price..."
                defaultValue={extra?.price} required />
        </div>

        {children}

    </form>
</>

export default ExtraForm;