import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import "./style.css";
import { requestHandler } from '../../../../common/utils';

const ImagePreview = ({ image, restaurantId }) => {

    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);

    const onDelete = async () => {
        const uri = `/owner/restaurants/${restaurantId}/image`;
        const action = async () => axios.delete(uri, {
            data: { imageId: image._id },
            validateStatus: false
        });
        const result = await requestHandler(action);
        if (result) history.go();
    };

    return <>
        <div className="card mb-2">
            <img src={image.uri} className="card-img-top thumb-img img-fluid"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsOpen(true)} />
            <div className="card-body">
                <button className="btn btn-danger btn-block" onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>

        {
            isOpen &&
            <Lightbox mainSrc={image.uri}
                onCloseRequest={() => setIsOpen(false)}
            />
        }
    </>
};

export default ImagePreview;