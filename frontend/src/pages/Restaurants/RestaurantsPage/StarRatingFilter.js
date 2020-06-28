import React, { useState } from 'react';
import StarRatings from "react-star-ratings";

const StarRatingFilter = ({ setRestaurantsRating }) => {

    const [rating, setRating] = useState(0);

    function onRatingChange(newRating) {
        setRating(newRating);
        setRestaurantsRating(newRating);
    };

    const onClear = () => {
        setRating(0);
        setRestaurantsRating(null);
    };

    return <>
        <h5>Opinions:</h5>

        <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={onRatingChange}
            name="rating"
            starDimension="20px"
        />

        {
            rating !== 0 &&
            <button className="btn btn-outline-secondary w-50 mt-2" onClick={onClear}>
                Clear stars
            </button>
        }
    </>
};

export default StarRatingFilter;