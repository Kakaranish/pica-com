import React, { useState, useEffect } from "react";
import moment from 'moment';
import axios from "axios";
import StarRatings from "react-star-ratings";
import { requestHandler } from "../../common/utils";

const OrderOpinionPage = ({ match }) => {

  const restaurantId = match.params.id;

  const [state, setState] = useState({ loading: true });

  const fetch = async () => {
    const uri = `/restaurants/${restaurantId}/opinions`;
    const action = async () => axios.get(uri);
    const result = await requestHandler(action);
    setState({ loading: false, opinionsInfo: result });
  };

  useEffect(() => {
    fetch();
  }, []);


  if (state.loading) return <></>
  else if (!state.opinionsInfo.opinions.length) return <div className="container">
    <h3>"{state.opinionsInfo.restaurant.name}" has no opinions yet</h3>
  </div>

  return (
    <div className="container">
      <h3>Opinions for "{state.opinionsInfo.restaurant.name}"</h3>

      {
        state.opinionsInfo.opinions.map((opinion, i) =>
          <div key={`o-${i}`}>
            <div className="d-flex align-items-center py-1">
              <div className="pt-2 mr-2">
                <b>Rating: </b>
              </div>
              <div>
                <StarRatings
                  rating={opinion.starRating}
                  starRatedColor="gold"
                  name="rating"
                  starDimension="20px"
                />
              </div>
            </div>

            <div className="mb-1">
              <b>Opinion: </b>
              {opinion.content} <br />
            </div>

            <div >
              <b>Added at </b> {moment(opinion.createdAt).format('YYYY-MM-DD HH:mm')}
            </div>

            {
              i !== state.opinionsInfo.opinions.length - 1 &&
              <div className="border-bottom border-darken-1 mt-3 mb-2"></div>
            }
          </div>
        )
      }

    </div>
  );
};

export default OrderOpinionPage;
