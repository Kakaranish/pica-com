import React from "react";

const RestaurantCard = (props) => {
  return (
    <div class="card mb-3">
      <div class="row no-gutters">
        <div class="col-md-4">
          <img
            src={
              props &&
              props.restaurant.images &&
              props.restaurant.images.length > 0
                ? props.restaurant.images[0].uri
                : ""
            }
            class="card-img"
            alt="..."
          />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">{props.restaurant.name}</h5>
            <ul>
              <li>Delivery price: {props.restaurant.deliveryPrice}</li>
              <li>Delivery time: {props.restaurant.avgDeliveryTime}</li>
              <li>
                Minimal free delivery price:{" "}
                {props.restaurant.minFreeDeliveryPrice}
              </li>
              {/* <li> */}
              {/* Delivery minimal order value: {props.restaurant.minimalOrderVal} */}
              {/* </li> */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
