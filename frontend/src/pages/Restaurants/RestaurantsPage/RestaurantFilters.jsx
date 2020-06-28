import React, { useState } from "react";
import FreeDeliveryMinPriceFilter from "./FreeDeliveryMinPriceFilter";
import DeliveryPriceFilter from "./DeliveryPriceFilter";
import StarRatingFilter from "./StarRatingFilter";


const RestaurantFilters = ({ setMinFreeDeliveryPrice, setDeliveryPrice, setRestaurantsRating }) => {

  return (
    <React.Fragment>

      <FreeDeliveryMinPriceFilter setMinFreeDeliveryPrice={setMinFreeDeliveryPrice} />

      <br />

      <DeliveryPriceFilter setDeliveryPrice={setDeliveryPrice} />

      <br />

      <StarRatingFilter setRestaurantsRating={setRestaurantsRating} />

    </React.Fragment>
  );
};

export default RestaurantFilters;
