import React from 'react';

const PizzaForm = ({ pizza, onSubmitCb = () => { }, children }) => {

	return <>
		<form onSubmit={onSubmitCb}>
			<div className="form-group">
				<label>Name</label>
				<input name="name" type="text" className="form-control"
					placeholder="Name..." defaultValue={pizza?.name} required />
			</div>

			<div className="form-group">
				<label>Description</label>
				<input name="description" type="text" className="form-control"
					placeholder="Description..." defaultValue={pizza?.description} required />
			</div>

			<div className="form-group">
				<label>Diameter</label>
				<input name="diameter" type="number" className="form-control"
					min={0} step={1} placeholder="Diameter..."
					defaultValue={pizza?.diameter} required />
			</div>

			<div className="form-group">
				<label>Price</label>
				<input name="price" type="number" className="form-control"
					min={0} step={0.01} placeholder="Price..."
					defaultValue={pizza?.price} required />
			</div>

			{children}

		</form>
	</>
};

export default PizzaForm;