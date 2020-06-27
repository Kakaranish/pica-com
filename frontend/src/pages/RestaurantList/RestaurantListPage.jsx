import React, { useState, useEffect } from "react";
import RestaurantList from "./RestaurantsList";
import FoodTypeBar from "./FoodTypeBar";
import "./RestaurantList.css";
import RestaurantFilter from "./RestaurantFilter";
import axios from "axios";
import { requestHandler } from "../../common/utils";

const RestaurantListPage = () => {
  const [type, setType] = useState("");
  const [minOrdVal, setMinOrdVal] = useState(1);
  const [freeDelivery, setFreeDelivery] = useState(0);
  const [restaurantsRating, setRestaurantsRating] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    console.log("Wysyłam");
    console.log(type);
    const fetch = async () => {
      const uri = `/restaurants/`;
      const action = async () =>
        axios.get(uri, { params: { type, freeDelivery, deliveryPrice, restaurantsRating } });
      const result = await requestHandler(action);
      setRestaurants(result);
      console.log(result);
    };
    fetch();
  }, [type, freeDelivery, deliveryPrice]);

  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <FoodTypeBar type={type} setType={setType} />
        </div>
        <div className="row mt-2">
          <div className="col-3">
            <RestaurantFilter
              setMinOrdVal={setMinOrdVal}
              setFreeDelivery={setFreeDelivery}
              minOrdVal={minOrdVal}
              setDeliveryPrice={setDeliveryPrice}
              setRestaurantsRating={setRestaurantsRating}
            />
          </div>
          <div className="col-9">
            <RestaurantList restaurants={restaurants} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default RestaurantListPage;
