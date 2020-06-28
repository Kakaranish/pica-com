import React from 'react';
import StarRatings from 'react-star-ratings';
import ImagePreview from '../../../common/components/ImagePreview';
import deliveryIcon from '../../../assets/img/delivery.svg';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

const RestaurantInfoHeader = ({ restaurant }) => {
	return <>

		<h3 className="mb-2">{restaurant.name}</h3>

		{
			restaurant?.categories?.length > 0 &&
			<>
				<b>Food categories: </b>
				{
					restaurant.categories.map((category, i) => <span key={`cat-${i}`}>
						{category.name}
						{i !== restaurant.categories.length - 1 && ', '}
					</span>)
				}
				<br />
			</>
		}

		<p>
			<b>Location: </b>
			{restaurant.location.city}, {restaurant.location.postcode},&nbsp;
			{restaurant.location.address}
		</p>

		{
			restaurant.images?.length > 0 &&
			<div className="row">
				{
					restaurant.images.map((image, i) =>
						<ImagePreview image={image} key={`prev-${i}`} />
					)
				}
			</div>
		}

		{
			restaurant.avgStarRating !== 0 &&
			<div className="my-4">
				<div className="d-flex align-items-center mb-2">
					<div className="mt-1 mr-2">
						Restaurant total rate:
				</div>

					<div data-tip={restaurant.avgStarRating ?? 0}>
						<StarRatings
							rating={restaurant.avgStarRating ?? 0}
							starRatedColor="gold"
							name="rating"
							starDimension="25px"
						/>
						<ReactTooltip />
					</div>
				</div>

				<Link to={`/restaurants/${restaurant._id}/opinions`}>
					See what people think about this restaurant
			</Link>
			</div>
		}

		<div className="card mt-2">
			<div className="card-header d-flex align-items-center bg-white py-1 px-3">
				<img src={deliveryIcon} style={{ width: '30px' }} className="mb-2 mr-2" />
				<h4>Delivery info</h4>
			</div>

			<div className="card-body">
				Average delivery time:&nbsp;
				{restaurant.avgDeliveryTime + restaurant.avgPreparationTime}m

				<br />

				Delivery price: {restaurant.deliveryPrice.toFixed(2)} PLN

				{
					restaurant.minFreeDeliveryPrice &&
					<>
						<br />
						Min free delivery price:&nbsp;
						{restaurant.minFreeDeliveryPrice.toFixed(2)} PLN
					</>
				}
			</div>
		</div>
	</>
};

export default RestaurantInfoHeader;