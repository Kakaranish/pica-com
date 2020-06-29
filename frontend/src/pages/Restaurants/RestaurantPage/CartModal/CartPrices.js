import React from 'react';
import cartBlackIcon from '../../../../assets/img/cart-black.svg';
import deliveryIcon from '../../../../assets/img/delivery.svg';
import moneyIcon from '../../../../assets/img/money.svg';

const CartPrices = ({ cartItemsPrice, deliveryPrice, toFreeDelivery }) => {
    return <>
        <div className="d-flex align-items-center">
            <img src={cartBlackIcon} style={{ width: '40px' }} />
            <b className="ml-3">
                Items In Cart Price:&nbsp;
                {(cartItemsPrice).toFixed(2)} PLN
            </b>
        </div>

        <div className="d-flex align-items-center mt-2">
            <img src={deliveryIcon} style={{ width: '40px' }} />
            <b className="ml-3">
                Delivery Price:&nbsp;
                {
                    !deliveryPrice
                        ? <span className="text-success">FREE</span>
                        : <>
                            {deliveryPrice.toFixed(2)} PLN&nbsp;
                            {
                                !!toFreeDelivery &&
                                <span className="text-success">
                                    ({toFreeDelivery.toFixed(2)} PLN to free delivery)
                                </span>
                            }
                        </>
                }
            </b>
        </div>

        <div className="d-flex align-items-center mt-2">
            <img src={moneyIcon} style={{ width: '40px' }} />
            <b className="ml-3">
                Total Price:&nbsp;
                {(cartItemsPrice + deliveryPrice).toFixed(2)} PLN
            </b>
        </div>
    </>
};

export default CartPrices;