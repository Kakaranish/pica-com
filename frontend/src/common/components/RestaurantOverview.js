import React from 'react';
import moment from 'moment';
import ImagePreview from './ImagePreview';

const RestaurantOverview = ({ restaurant, children }) => {
    return <>
        <h3 className="mb-4">Basic Info</h3>
        <div className="p-3 mb-2" style={{ border: '1px solid gray' }}>
            <p>
                <b>Id: </b> {restaurant._id}
            </p>

            <p>
                <b>Status: </b> {restaurant.status}
            </p>

            <p>
                <b>Created At: </b> {moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>

            <p>
                <b>Name: </b> {restaurant.name}
            </p>

            <p>
                <b>Description: </b> {restaurant.description}
            </p>

            <p>
                <b>City: </b> {restaurant.location.city}
            </p>

            <p>
                <b>Postcode: </b> {restaurant.location.postcode}
            </p>

            <p>
                <b>Address: </b> {restaurant.location.address}
            </p>

            <p>
                <b>Contact number: </b> {restaurant.contactNumber}
            </p>
        </div>

        <h3 className="my-4">Gallery</h3>
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

        <h3 className="my-4">Pizzas</h3>

        {
            !restaurant.menu.pizzas.length
                ? <p>Nothing here</p>
                : restaurant.menu.pizzas.map((pizza, i) =>
                    <div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`p-${i}`}>
                        <p>
                            <b>Name: </b> {pizza.name}
                        </p>

                        <p>
                            <b>Description: </b> {pizza.description}
                        </p>

                        <p>
                            <b>Diameter: </b> {pizza.diameter} cm
        	            </p>

                        <p>
                            <b>Price: </b> {pizza.price.toFixed(2)} PLN
        			    </p>
                    </div>
                )
        }

        <h3 className="my-4">Extra ingredients</h3>
        {
            !restaurant.menu.extraIngredients.length
                ? <p>Nothing here</p>
                : restaurant.menu.extraIngredients.map((extraIngredient, i) =>
                    <div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`e-i-${i}`}>
                        <p>
                            <b>Name: </b> {extraIngredient.name}
                        </p>

                        <p>
                            <b>Price: </b> {extraIngredient.price.toFixed(2)} PLN
        			    </p>
                    </div>
                )
        }

        <h3 className="my-4">Extras</h3>
        {
            !restaurant.menu.extras.length
                ? <p>Nothing here</p>
                : restaurant.menu.extras.map((extra, i) =>
                    <div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`e-i-${i}`}>
                        <p>
                            <b>Name: </b> {extra.name}
                        </p>

                        <p>
                            <b>Price: </b> {extra.price.toFixed(2)} PLN
        			    </p>
                    </div>
                )
        }

        {children}
    </>
};

export default RestaurantOverview;