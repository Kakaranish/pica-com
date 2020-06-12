import React from 'react';
import Restaurants from './Restaurants';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import { Link } from 'react-router-dom';

const CancelledRestaurants = ({ currentTab }) => <>
    <Restaurants currentTab={currentTab}
        status="cancelled"
        showRestaurants={restaurants => restaurants.map((restaurant, i) =>
            <div className="p-3" style={{ border: '1px solid green' }}
                key={`r-${i}`}>

                <RestaurantBasicInfo restaurant={restaurant} />

                <Link to={`/admin/manage/restaurants/${restaurant._id}`}
                    className="btn btn-primary mr-2">
                    Show full info
                </Link>
            </div>
        )}
    />
</>

export default CancelledRestaurants;