import React from 'react';

const DeliveryAddress = ({ address }) => {
    return <>
        <div className="accordion" id="deliveryAccordion">
            <div className="card">
                <div className="card-header" id="deliveryHeading" data-toggle="collapse"
                    data-target="#deliveryCollapse" aria-expanded="true"
                    aria-controls="deliveryCollapse"
                    style={{ cursor: 'pointer' }}>

                    <h4 className="align-content-lg-end btn-link">
                        Delivery Address
					</h4>
                </div>

                <div id="deliveryCollapse" className="collapse"
                    aria-labelledby="deliveryHeading" data-parent="#deliveryAccordion">
                    <div className="card-body">

                        <p>
                            <b>City: </b> {address.city}
                        </p>

                        <p>
                            <b>Postcode: </b> {address.postcode}
                        </p>

                        <p>
                            <b>Address: </b> {address.address}
                        </p>

                        {
                            address.flatCode &&
                            <p>
                                <b>Flat Code: </b> {address.flatCode}
                            </p>
                        }

                    </div>
                </div>
            </div>
        </div>
    </>
};

export default DeliveryAddress;