import React, { useState } from 'react';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';
import { useHistory } from 'react-router-dom';

const ImageUploader = ({ restaurantId, onImageUploadCb }) => {

    const history = useHistory();
    const [image, setImage] = useState(null);

    const onChange = event => {
        const file = event.target.files[0];
        if (!file || !isFileImageType(file)) {
            setImage(null);
            return;
        }
        setImage(file);
    };

    const onImageUpload = async event => {
        event.preventDefault();
        if (!image) {
            alert('No image chosen');
            return;
        }

        const formData = new FormData(event.target);
        formData.append('file', image);

        const uri = `/restaurants/${restaurantId}/pic-url`;
        const action = async () => axios.post(uri, formData, {
            validateStatus: false,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const result = await requestHandler(action, {
            status: 400,
            callback: async (res) => {
                console.log(res);
                // todo:
            }
        });
        if (!result) return;

        setImage(null);

        onImageUploadCb(result);
        history.go();
    }

    return (
        <>
            <div className="custom-file">
                <input className="custom-file-input" type="file" onChange={onChange} accept="image/*" />
                <label className="custom-file-label" htmlFor="uploadedFile">Choose image</label>
            </div>

            <form onSubmit={onImageUpload}>
                <button type="submit" className="btn btn-success btn-block">
                    Upload Image
                </button>
            </form>

            {
                image &&
                <div className="text-center mt-4 mb-2">
                    <img src={URL.createObjectURL(image)} className="img-fluid" />
                </div>
            }

        </>
    );
};

/**
 * @param {File} file 
 */
const isFileImageType = file => {
    const fileType = file.type;
    const validImageTypes = ['image/jpeg', 'image/png'];
    return validImageTypes.includes(fileType);
}

export default ImageUploader;