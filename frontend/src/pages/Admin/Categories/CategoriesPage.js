import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { requestHandler } from '../../../common/utils';
import CategoryItem from './components/CategoryItem';

const CategoriesPage = () => {

	const createUri = '/admin/manage/categories/create';

	const [state, setState] = useState({ loading: true });
	useEffect(() => {
		const fetch = async () => {
			const action = async () => axios.get('/categories',
				{ validateStatus: false });
			const result = await requestHandler(action);
			setState({ loading: false, categories: result });
		};
		fetch();
	}, []);

	if (state.loading) return <></>
	else if (!state.categories?.length) return <>
		<h3 className="mb-3">No categories</h3>
		
		<Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
			<div>
				<FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
			</div>
			<div className="text-decoration-none text-dark">
				Create Category
            </div>
		</Link>
	</>

	return <>
		<h3 className="mb-3">Manage pizza categories</h3>

		<Link to={createUri} className="d-flex align-items-center text-decoration-none mb-3">
			<div>
				<FontAwesomeIcon icon={faPlus} size={'2x'} style={{ color: 'green', height: "20px" }} />
			</div>
			<div className="text-decoration-none text-dark">
				Create Category
            </div>
		</Link>

		{
			state.categories.map((category, i) =>
				<div key={`u-${i}`} className='p-3 mb-3 border border-darken-1 item-box'>
					<CategoryItem category={category} />
				</div>
			)
		}
	</>
};

export default CategoriesPage;