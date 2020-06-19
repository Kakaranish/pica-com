import React from 'react';

const ExtraItem = ({ extraItem }) => {

    const calculateTotalPrice = extraItem =>
        extraItem.quantity * extraItem.extra.price;

    return <>
        <div className="p-3 border border-darken-1">
            <p>
                <b>{extraItem.extra.name}</b>&nbsp;
                <span style={{ color: 'gray' }}>
                    ({extraItem.extra.price.toFixed(2)}PLN)
				</span>
            </p>

            <p>
                <b>Total price: </b>
                {extraItem.quantity} x&nbsp;
				{extraItem.extra.price.toFixed(2)}PLN =&nbsp;
				{calculateTotalPrice(extraItem).toFixed(2)}PLN
			</p>
        </div>
    </>
};

export default ExtraItem;