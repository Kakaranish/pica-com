import React from 'react';
import RestaurantsTabContent from './RestaurantsTabContent';
import RestaurantInfo from '../RestaurantInfo';

const AcceptedRestaurants = ({ restaurants, isActive }) => {

    if (!restaurants?.length) return <>
        <RestaurantsTabContent isActive={isActive} status='ACCEPTED'>
            <h3>No restaurants</h3>
        </RestaurantsTabContent>
    </>

    return <>
        <RestaurantsTabContent isActive={isActive} status='ACCEPTED'>
            {
                restaurants.map((restaurant, i) => <>
                    <RestaurantInfo>
                        
                    </RestaurantInfo>
                </>)
            }
        </RestaurantsTabContent>
    </>
};

export default AcceptedRestaurants;