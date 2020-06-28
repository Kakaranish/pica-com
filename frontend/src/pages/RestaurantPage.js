import React, { useState, useEffect } from "react";
import axios from "axios";
import { requestHandler } from "../common/utils";
import PizzaItem from "./RestaurantPage/PizzaItem";
import ExtraItem from "./RestaurantPage/ExtraItem";
import RestaurantInfoHeader from "./RestaurantPage/RestaurantInfoHeader";
import BottomBar from "./RestaurantPage/BottomBar";
import AwareComponentBuilder from "../common/AwareComponentBuilder";
import RestaurantOpinions from "./Opinion/RestaurantOpinions";

const RestaurantPage = (props) => {
  const restaurantId = props.match.params.id;

  const [state, setState] = useState({ loading: true });
  const [selectedTab, setSelectedTab] = useState("menu");

  useEffect(() => {
    const fetch = async () => {
      const uri = `/restaurants/${restaurantId}/populated`;
      const action = async () => axios.get(uri, { validateStatus: false });
      const restaurant = await requestHandler(action);
      setState({ loading: false, restaurant });
    };
    fetch();
  }, []);

  const onPizzaAddToCart = (pizzaCartItem) =>
    props.addPizzaToCart(restaurantId, pizzaCartItem);

  const onExtraAddToCart = (extraCartItem) =>
    props.addExtraToCart(restaurantId, extraCartItem);

  if (state.loading) return <></>;
  else if (!state?.restaurant) return <h3>No such restaurant</h3>;

  var tab;

  if (selectedTab === "menu") {
    tab = (
      <React.Fragment>
        {" "}
        <h3 className="mt-3">Pizza</h3>
        {state.restaurant.menu.pizzas.map((pizza, i) => (
          <div className="p-3 mb-2 border border-darken-1" key={`p-${i}`}>
            <PizzaItem
              pizza={pizza}
              addToCartCb={onPizzaAddToCart}
              extraIngredients={state.restaurant.menu.extraIngredients}
            />
          </div>
        ))}
        <h3 className="mt-3">Extras</h3>
        {state.restaurant.menu.extras.map((extra, i) => (
          <div className="p-3 mb-2 border border-darken-1" key={`e-${i}`}>
            <ExtraItem extra={extra} addToCartCb={onExtraAddToCart} />
          </div>
        ))}
        <BottomBar
          restaurantId={restaurantId}
          minFreeDeliveryPrice={state.restaurant.minFreeDeliveryPrice}
          deliveryPrice={state.restaurant.deliveryPrice}
        />{" "}
      </React.Fragment>
    );
  } else {
    tab = <RestaurantOpinions restaurantId={restaurantId} />;
  }

  return (
    <>
      <RestaurantInfoHeader restaurant={state.restaurant} />

      <div class="btn-group" role="group" aria-label="Basic example">
        <button
          type="button"
          class="btn btn-secondary"
          onClick={() => setSelectedTab("menu")}
        >
          Menu
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          onClick={() => setSelectedTab("opinions")}
        >
          Opinions
        </button>
      </div>
      {tab}
    </>
  );
};

export default new AwareComponentBuilder()
  .withCartsAwareness()
  .build(RestaurantPage);
