import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Lightbox from 'react-image-lightbox';
import { requestHandler } from '../../../../common/utils';
import 'react-image-lightbox/style.css';
import "./style.css";
import { toast } from 'react-toastify';

const ImagePreview = ({ image, restaurantId }) => {

    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);

    const onDelete = async () => {
        const uri = `/owner/restaurants/${restaurantId}/image`;
        const action = async () => axios.delete(uri, {
            data: { imageId: image._id },
            validateStatus: false
        });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Image deleted');
                history.push('/refresh');
            }
        });
    };

    return <>
        <div className="card mb-2">
            <img src={image.thumbnailUri} className="card-img-top thumb-img img-fluid"
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
            <Lightbox
                mainSrc={image.uri}
                onCloseRequest={() => setIsOpen(false)}
            />
        }
    </>
};

export default ImagePreview;