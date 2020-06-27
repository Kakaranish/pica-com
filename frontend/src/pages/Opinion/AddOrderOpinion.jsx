import React, { useState, useEffect } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { requestHandler } from "../../common/utils";

const OrderOpinionPage = (props) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  function changeRating(newRating) {
    setRating(newRating);
  }

  function addReview() {
    const post = async () => {
      const uri = `/opinions/`;
      const action = async () =>
        axios.post(uri, {
          orderId: props.orderId,
          restaurantId: props.restaurantId,
          starRating: rating,
          content: content,
        });
      const result = await requestHandler(action);
      setContent("");
    };
    post();
  }

  function onReviewChange(e) {
    setContent(e.target.value);
  }

  return (
    <React.Fragment>
      <h3>Opinion:</h3>
      <div class="form-group">
        <form>
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            name="rating"
            changeRating={changeRating}
            starDimension="25px"
          />
          <br />
          <br />
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={content}
            onChange={onReviewChange}
          ></textarea>
          <br />
          <button onClick={addReview} type="button" class="btn btn-secondary">
            Add opinion
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default OrderOpinionPage;
