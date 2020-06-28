import React, { useState } from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { requestHandler } from "../../common/utils";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const OrderOpinionPage = ({ orderId, restaurantId }) => {
  
  const history = useHistory();
  
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  function changeRating(newRating) {
    setRating(newRating);
  }

  function addReview() {
    const post = async () => {
      
      const uri = `/restaurants/${restaurantId}/opinions`;
      const action = async () =>
        axios.post(uri, {
          orderId: orderId,
          restaurantId: restaurantId,
          starRating: rating,
          content: content
        }, { validateStatus: false });
      
        await requestHandler(action, {
        status: 200,
        callback: async () => {
          toast('Opinion added');
          history.push('/refresh');
        }
      });
      
    };
    post();
  }

  function onReviewChange(e) {
    setContent(e.target.value);
  }

  return (
    <React.Fragment>
      <h3>Add opinion:</h3>
      <div className="form-group">
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
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={content}
            onChange={onReviewChange}
          ></textarea>
          <br />
          <button onClick={addReview} type="button" className="btn btn-success">
            Add
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default OrderOpinionPage;
