import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';
import CategoryItem from './components/CategoryItem';

const CategoriesPage = () => {

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
		<h3>No categories</h3>
		<Link className="btn btn-primary" to={'/admin/manage/categories/create'}>
			Create Category
        </Link>
	</>

	return <>
		{
			state.categories.map((category, i) =>
				<div key={`u-${i}`} className='p-3 mb-3' style={{ border: '1px solid red' }}>
					<CategoryItem category={category} />
				</div>
			)
		}

		<Link className="btn btn-primary" to={'/admin/manage/categories/create'}>
			Create Category
		</Link>
	</>
};

export default CategoriesPage;