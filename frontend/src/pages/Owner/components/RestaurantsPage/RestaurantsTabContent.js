import React from 'react';

const RestaurantsTabContent = ({ status, children, isActive }) => {

	const initial = `nav-${status.toLowerCase()}`

	return <>
		<div className={`tab-pane fade show p-3 ${isActive ? 'active' : null}`}
			id={`${initial}`} role="tabpanel"
			 aria-labelledby={`${initial}-tab`}>

			{children}

		</div>
	</>
};

export default RestaurantsTabContent;