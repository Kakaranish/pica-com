import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { requestHandler } from "../../common/utils";
import OrderedItems from "../../common/components/Order/OrderedItems";
import DeliveryAddress from "../../common/components/Order/DeliveryAddress";
import DeliveryStatus from "./OrderPage/OrderStatus";
import OrderTimer from "./OrderPage/OrderTimer";
import AddOrderOpinion from "../Opinion/AddOrderOpinion";

const OrderPage = ({ match }) => {
  const orderId = match.params.id;
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    const fetch = async () => {
      const uri = `/orders/${orderId}`;
      const fetchOrderAction = async () => axios.get(uri, { validateStatus: false });
      const order = await requestHandler(fetchOrderAction);
      setState({ loading: false, order });
    };
    fetch();
  }, []);

  const shouldBeTimerVisible = () =>
    state.order.estimatedDeliveryTime &&
    moment(state.order.estimatedDeliveryTime).isAfter(moment());

  if (state.loading) return <></>;
  else if (!state.order) return <h3>There is no such order</h3>;

  return (
    <>
      <h3 className="mb-2">Order '{orderId}'</h3>

      <b>Created At:</b> {moment(state.order.createdAt).format('YYYY-MM-DD HH:mm')}
      <br />

      <b>Restaurant: </b>&nbsp;
      <Link to={`/restaurants/${state.order.restaurant._id}`}>
        {state.order.restaurant.name}
      </Link>
      <br />

      <DeliveryStatus order={state.order} />

      {shouldBeTimerVisible() && <OrderTimer order={state.order} />}

      <div className="mb-3"></div>

      <DeliveryAddress address={state.order.deliveryAddress} />

      <div className="mb-3"></div>

      <OrderedItems order={state.order} />
      <br />

      {
        !state.order.opinion
          ? <AddOrderOpinion
            orderId={orderId}
            restaurantId={state.order.restaurant._id}
          />

          :
          <div>
            <h4>Your opinion</h4>

            <div className="mb-1">
              <div>
                <b>Rating: </b>
              </div>

              <div>

                <StarRatings
                  rating={state.order.opinion.starRating}
                  starRatedColor="gold"
                  name="rating"
                  starDimension="20px"
                />
              </div>
            </div>

            <p>
              {
                state.order.opinion.content && <>
                  <b>Opinion: </b>
                  {state.order.opinion.content} <br />
                </>
              }
            </p>
          </div>
      }
    </>
  );
};

export default OrderPage;
