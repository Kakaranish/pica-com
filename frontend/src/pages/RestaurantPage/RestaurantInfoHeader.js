import React from 'react';
import ImagePreview from '../../common/components/ImagePreview';
import deliveryIcon from '../../assets/img/delivery.svg';

const RestaurantInfoHeader = ({ restaurant }) => {
    return <>

        <h3>{restaurant.name}</h3>
        <p>
            <b>Location: </b>
            {restaurant.location.city}, {restaurant.location.postcode},&nbsp;
            {restaurant.location.address}
        </p>
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

        <div className="card mt-2">
            <div className="card-header d-flex align-items-center bg-white py-1 px-3">
                <img src={deliveryIcon} style={{ width: '30px' }} className="mb-2 mr-2" />
                <h4>Delivery info</h4>
            </div>

            <div className="card-body">
                Average delivery time:&nbsp;
                {restaurant.avgDeliveryTime + restaurant.avgPreparationTime}m

                <br />

                Delivery price: {restaurant.deliveryPrice.toFixed(2)} PLN

                {
                    restaurant.minFreeDeliveryPrice &&
                    <>
                        <br />
                        Min free delivery price:&nbsp;
                        {restaurant.minFreeDeliveryPrice.toFixed(2)} PLN
                    </>
                }
            </div>
        </div>
    </>
};

export default RestaurantInfoHeader;