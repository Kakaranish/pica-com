import React from "react";
import noImageIcon from "../../../assets/img/no-image.svg";
import bagIcon from '../../../assets/img/bag.svg';
import clockIcon from '../../../assets/img/clock.svg';
import deliveryIcon from '../../../assets/img/delivery.svg';

const RestaurantCard = ({ restaurant }) => {

  return (
    <div className="card mb-3">
      <div className="row no-gutters">
          <img
            src={
              restaurant?.images?.length
                ? restaurant.images[0].thumbnailUri
                : noImageIcon
            }
            className="card-img thumb-img img-fluid"
            style={{
              cursor: 'pointer',
              objectFit: 'cover',
              overflow: 'hidden',
              height: '150px',
              width: "150px",
              overflow: 'hidden'
            }}
            alt="..."
          />
          <div className="card-body">

            <h5 className="mb-0">
              {restaurant.name}
            </h5>

            {
              restaurant?.categories?.length > 0 &&
              restaurant.categories.map((category, i) =>
                <span style={{ color: "darkgray" }} key={`cat-${i}-${restaurant._id}`}>
                  {category.name}
                  {i !== restaurant.categories.length - 1 && ', '}
                </span>)
            }


            <div className="d-flex align-content-center mt-3">
              <div>
                <img src={clockIcon} style={{
                  height: "20px",
                  filter: "invert(0.6)"
                }}
                  className="mr-1" />
                <span style={{ color: "darkgray" }}>
                  {restaurant.avgDeliveryTime}m
                </span>
              </div>

              <div className="ml-3">
                <img src={deliveryIcon} style={{
                  height: "20px",
                  filter: "invert(0.6)"
                }}
                  className="mr-1" />
                <span style={{ color: "darkgray" }}>
                  {restaurant.deliveryPrice.toFixed(2)}PLN
                </span>
              </div>

              {
                !!restaurant.minFreeDeliveryPrice &&
                <div className="ml-3">
                  <img src={bagIcon} style={{
                    height: "20px",
                    filter: "invert(0.6)"
                  }}
                    className="mr-1" />
                  <span style={{ color: "darkgray" }}>
                    {restaurant.minFreeDeliveryPrice.toFixed(2)}PLN
                </span>
                </div>
              }
            </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
