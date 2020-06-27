import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { requestHandler } from "../../common/utils";

const OrderOpinionPage = (props) => {
  const [opinions, setOpinions] = useState([]);

  useEffect(() => {
    console.log("Wysyłam");
    fetch();
  }, []);

  const fetch = async () => {
    const uri = `/opinions/`;
    const action = async () =>
      axios.get(uri, { params: { restaurantId: props.restaurantId } });
    const result = await requestHandler(action);
    setOpinions(result);
    console.log(result);
  };

  return (
    <div class="container">
      <h3>Opinions</h3>
      {opinions.map((opinion) => (
        <div>
          <p>
            <b>Rating: </b>
            <StarRatings
              rating={opinion.starRating}
              starRatedColor="gold"
              name="rating"
              starDimension="20px"
            />
            <br />
            <b>Opinion: </b>
            {opinion.content} <br />
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderOpinionPage;
