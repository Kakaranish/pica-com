import React, { useState, useEffect } from "react";
import StarRatings from "../../../node_modules/react-star-ratings";

const RestaurantFilter = (props) => {
  const [minFreeDelPrice, setMinFreeDelPrice] = useState([true, false, false]);
  const [deliveryPrice, setDeliveryPrice] = useState([true, false, false]);
  const [rating, setRating] = useState(0);

  function onMinFreeDelPriceChange(index, minFreeDeliveryPrice) {
    props.setFreeDelivery(minFreeDeliveryPrice);
    let items = [...minFreeDelPrice];
    items = items.map((item) => false);
    items[index] = true;
    setMinFreeDelPrice(items);
  }

  function onDeliveryPriceChange(index, deliveryPriceValue) {
    props.setDeliveryPrice(deliveryPriceValue);
    let items = [...deliveryPrice];
    items = items.map((item) => false);
    items[index] = true;
    setDeliveryPrice(items);
  }

  function onRatingChange(newRating) {
    setRating(newRating);
    props.setRestaurantsRating(newRating);
  }

  return (
    <React.Fragment>
      <h5 style={{ marginTop: "10px" }}>Darmowa dostawa przy zamówieniu:</h5>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="freeDeliveryRadio"
          id="freeDeliveryRadio1"
          onClick={() => {
            onMinFreeDelPriceChange(0, 0);
          }}
          value={0}
          checked={minFreeDelPrice[0]}
        />
        <label class="form-check-label" for="freeDeliveryRadio1">
          Nie gra roli
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="freeDeliveryRadio"
          id="freeDeliveryRadio2"
          onClick={() => {
            onMinFreeDelPriceChange(1, 30);
          }}
          value={30}
          checked={minFreeDelPrice[1]}
        />
        <label class="form-check-label" for="freeDeliveryRadio2">
          30 zł lub mniej
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="freeDeliveryRadio"
          id="freeDeliveryRadio3"
          onClick={() => {
            onMinFreeDelPriceChange(2, 50);
          }}
          value={50}
          checked={minFreeDelPrice[2]}
        />
        <label class="form-check-label" for="freeDeliveryRadio3">
          50 zł lub mniej
        </label>
      </div>
      <br />
      <h5 style={{ marginTop: "10px" }}>Koszt dostawy:</h5>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="deliveryPriceRadio"
          id="deliveryPriceRadio1"
          onClick={() => {
            onDeliveryPriceChange(0, 0);
          }}
          value={0}
          checked={deliveryPrice[0]}
        />
        <label class="form-check-label" for="freeDeliveryRadio1">
          Nie gra roli
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="deliveryPriceRadio"
          id="deliveryPriceRadio2"
          onClick={() => {
            onDeliveryPriceChange(1, 5);
          }}
          checked={deliveryPrice[1]}
        />
        <label class="form-check-label" for="freeDeliveryRadio2">
          5 zł lub mniej
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          name="deliveryPriceRadio"
          id="deliveryPriceRadio3"
          onClick={() => {
            onDeliveryPriceChange(2, 10);
          }}
          checked={deliveryPrice[2]}
        />
        <label class="form-check-label" for="freeDeliveryRadio3">
          10 zł lub mniej
        </label>
      </div>
      <br />
      <h5>Opinie:</h5>
      <StarRatings
        rating={rating}
        starRatedColor="gold"
        changeRating={onRatingChange}
        name="rating"
        starDimension="20px"
      />
    </React.Fragment>
  );
};

export default RestaurantFilter;
