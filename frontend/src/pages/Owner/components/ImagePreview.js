import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { requestHandler } from '../../../common/utils';

const ImagePreview = ({ picture, restaurantId }) => {

    const history = useHistory();
    
    const [isOpen, setIsOpen] = useState(false);

    const onDelete = async () => {

        const uri = `/restaurants/${restaurantId}/pic-url`;
        const action = async () => axios.delete(uri, {
            data: { imageId: picture._id },
            validateStatus: false
        });
        const result = await requestHandler(action);
        if(result) history.go();
    };

    return <>
        <div className="card mb-2">
            <img src={picture.uri} className="card-img-top thumb-img img-fluid"
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
            <Lightbox mainSrc={picture.uri}
                onCloseRequest={() => setIsOpen(false)}
            />
        }
    </>
};

export default ImagePreview;