import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';

const ImagePreview = ({ image }) => {

    const [isOpen, setIsOpen] = useState(false);

    return <>
        <div className="col-2">
            <div className="card mb-2 ">
                <img src={image.thumbnailUri}
                    className="card-img-top thumb-img img-fluid"
                    style={{
                        cursor: 'pointer',
                        objectFit: 'cover',
                        overflow: 'hidden',
                        height: '8vw'
                    }}
                    onClick={() => setIsOpen(true)}
                />
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