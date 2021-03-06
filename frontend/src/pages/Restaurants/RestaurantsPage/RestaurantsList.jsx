import React from "react";
import RestaurantCard from "./RestaurantCard";
import { Link } from "react-router-dom";

const RestaurantList = (props) => {
  return props.restaurants.map((restaurant, i) =>
    <div key={`r-${i}`}>
      <Link
        to={"/restaurants/" + restaurant._id}
        style={{ textDecoration: "none", color: "black" }}
      >
        <RestaurantCard restaurant={restaurant} />
      </Link>

    </div>
  );
};

export default RestaurantList;
