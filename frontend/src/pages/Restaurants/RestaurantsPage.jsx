import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from 'query-string';
import RestaurantList from "./RestaurantsPage/RestaurantsList";
import CategoryBar from "./RestaurantsPage/CategoryBar";
import "./RestaurantsPage/RestaurantList.css";
import RestaurantFilters from "./RestaurantsPage/RestaurantFilters";
import { requestHandler } from "../../common/utils";
import { useHistory } from "react-router-dom";

const RestaurantListPage = (props) => {

  const history = useHistory();
  const queryParams = queryString.parse(props.location.search);
  if (!queryParams.city) history.push('/');

  const [state, setState] = useState({ loading: true });
  const [categoryId, setCategoryId] = useState(null);
  const [minFreeDeliveryPrice, setMinFreeDeliveryPrice] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [starRating, setStarRating] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const uri = `/restaurants/`;

      let params = { city: queryParams.city };
      if (categoryId) params.categoryId = categoryId;
      if (starRating) params.starRating = starRating;
      if (deliveryPrice) params.deliveryPrice = deliveryPrice;
      if (minFreeDeliveryPrice) params.minFreeDeliveryPrice = minFreeDeliveryPrice;

      const action = async () => axios.get(uri, { params: params });
      const restaurants = await requestHandler(action);
      setState({ loading: false, restaurants });
    };

    fetch();
  }, [categoryId, minFreeDeliveryPrice, deliveryPrice, starRating]);

  return <React.Fragment>
    <div className="container">
      <div className="row mb-3">
        <CategoryBar type={categoryId} setCategoryId={setCategoryId} />
      </div>

      <div className="row mt-2">
        <div className="col-3">
          <RestaurantFilters
            setMinFreeDeliveryPrice={setMinFreeDeliveryPrice}
            setDeliveryPrice={setDeliveryPrice}
            setRestaurantsRating={setStarRating}
          />
        </div>

        <div className="col-9">
          {
            state.isLoading ? <></>
              : state?.restaurants?.length > 0
                ? <RestaurantList restaurants={state.restaurants} />
                : <h3>No restaurants for these critieria</h3>
          }
        </div>
      </div>
    </div>
  </React.Fragment>
};

export default RestaurantListPage;
