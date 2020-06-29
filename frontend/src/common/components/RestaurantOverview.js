import React from 'react';
import moment from 'moment';
import ImagePreview from './ImagePreview';

const RestaurantOverview = ({ restaurant, children }) => {
    return <>
        <h3 className="mb-3">Basic Info</h3>
        <div className="p-3 mb-2 border border-darken-1">
            <b>Id: </b> {restaurant._id}

            <br />

            <b>Status: </b> {restaurant.status}

            <br />

            <b>Created At: </b> {moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}

            <br />

            <b>Name: </b> {restaurant.name}

            <br />

            <b>Description: </b> {restaurant.description}

            <br />

            <b>City: </b> {restaurant.location.city}

            <br />

            <b>Postcode: </b> {restaurant.location.postcode}

            <br />

            <b>Address: </b> {restaurant.location.address}

            <br />

            <b>Contact number: </b> {restaurant.contactNumber}

            <br />

            <b>Categories: </b>
            {
                restaurant.categories.map((cat, i) => <span key={`cat-${i}`}>
                    {cat.name}{i != restaurant.categories.length - 1 && ", "}
                </span>)
            }
        </div>

        <h3 className="mb-3">Delivery info</h3>
        <div className="p-3 mb-2 border border-darken-1">

            <b>Delivery price: </b> {restaurant.deliveryPrice.toFixed(2)} PLN

            <br />

            {
                !restaurant.minFreeDeliveryPrice
                    ? <>
                        <b>No min free delivery price</b>
                        <br />
                    </>
                    : <>
                        <b>Min free delivery price: </b>
                        {restaurant.minFreeDeliveryPrice.toFixed(2)} PLN
                        <br />
                    </>
            }


            <b>Averate order preparation time: </b> {restaurant.avgPreparationTime}m

            <br />

            <b>Average delivery time: </b> {restaurant.avgDeliveryTime}m
        </div>

        <h3 className="my-3">Gallery</h3>
        {
            !restaurant.images.length
                ? <p>Nothing here</p>
                : <div className="row">
                    {
                        restaurant.images.map((image, i) =>
                            <ImagePreview image={image} key={`prev-${i}`} />
                        )
                    }
                </div>
        }

        <h3 className="my-3">Pizzas</h3>

        {
            !restaurant.menu.pizzas.length
                ? <p>Nothing here</p>
                : restaurant.menu.pizzas.map((pizza, i) =>
                    <div className="p-3 mb-2 border border-darken-1" key={`p-${i}`}>
                        <b>Name: </b> {pizza.name}

                        <br />

                        <b>Description: </b> {pizza.description}

                        <br />

                        <b>Diameter: </b> {pizza.diameter} cm

                        <br />

                        <b>Price: </b> {pizza.price.toFixed(2)} PLN
                    </div>
                )
        }

        <h3 className="my-3">Extra ingredients</h3>
        {
            !restaurant.menu.extraIngredients.length
                ? <p>Nothing here</p>
                : restaurant.menu.extraIngredients.map((extraIngredient, i) =>
                    <div className="p-3 mb-2 border border-darken-1" key={`e-i-${i}`}>
                        <b>Name: </b> {extraIngredient.name}

                        <br />

                        <b>Price: </b> {extraIngredient.price.toFixed(2)} PLN
                    </div>
                )
        }

        <h3 className="my-3">Extras</h3>
        {
            !restaurant.menu.extras.length
                ? <p>Nothing here</p>
                : restaurant.menu.extras.map((extra, i) =>
                    <div className="p-3 mb-2 border border-darken-1" key={`e-i-${i}`}>
                        <b>Name: </b> {extra.name}

                        <br />

                        <b>Price: </b> {extra.price.toFixed(2)} PLN
                    </div>
                )
        }

        <div className="mb-4"></div>

        {children}
    </>
};

export default RestaurantOverview;