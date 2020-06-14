import React from 'react';
import { Link } from 'react-router-dom';

const ManagePage = () => <>
    <div className="p-3 mb-2">
        <p>
            <Link to={'/admin/manage/users'}>
                Manage Users
            </Link>
        </p>

        <p>
            <Link to={'/admin/manage/restaurants'}>
                Manage Restaurants
            </Link>
        </p>

        <p>
            <Link to={'/admin/manage/categories'}>
                Manage Categories
            </Link>
        </p>
    </div>
</>

export default ManagePage;