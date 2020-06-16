import React from 'react';
import ImagePreview from '../../common/components/ImagePreview';

const RestaurantInfoHeader = ({ restaurant }) => {
    return <>
        <h3>{restaurant.name}</h3>

        {
            restaurant.images?.length &&
            <div className="row">
                {
                    restaurant.images.map((image, i) =>
                        <ImagePreview image={image} key={`prev-${i}`} />
                    )
                }
            </div>
        }

        <p>
            <b>Location: </b>
            {restaurant.location.city}, {restaurant.location.postcode},
            {restaurant.location.address}
        </p>
    </>
};

export default RestaurantInfoHeader;