import React from 'react';
import { useHistory } from 'react-router-dom';
import { getFormDataJsonFromEvent, normalizeText } from '../common/utils';
import mainBgImg from '../assets/img/main-bg.jpg';
import Navbar from '../skeleton/Navbar';

const MainPage = () => {

	const history = useHistory();

	const onSubmit = async event => {
		event.preventDefault();
		const formData = getFormDataJsonFromEvent(event);
		if (!formData.city) return;

		const normalizedCity = normalizeText(formData.city);
		history.push(`/restaurants?city=${normalizedCity}`);
	}

	return <>
		<div className="container-fluid p-0">
			<Navbar />
			<div className="w-100 py-5 text-center" style={{ background: "darkgray" }}>
				<h1>
					It's time to order...<br />
					<b>PIZZA</b>
				</h1>

				<h3>Tell us the city where you live in</h3>

				<div className="container mt-4">
					<form className="form-inline" onSubmit={onSubmit}>
						<input name="city" className="form-control" type="search"
							placeholder="City..." aria-label="Search"
							style={{ width: "90%" }} />

						<button className="btn btn-primary my-2" type="submit" style={{ width: "10%" }}>
							Search
					</button>
					</form>
				</div>
			</div>
		</div>
	</>
};

export default MainPage;