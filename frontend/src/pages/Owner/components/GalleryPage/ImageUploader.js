import React, { useState } from 'react';
import axios from 'axios';
import { requestHandler } from '../../../../common/utils';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const maxSizeInMB = 3;

const ImageUploader = ({ restaurantId }) => {

    const history = useHistory();
    const [image, setImage] = useState(null);

    const onChange = event => {
        const file = event.target.files[0];
        if (!file || !isFileImageType(file)) {
            setImage(null);
            return;
        }
        if (!hasValidSize(file)) {
            toast.error(`Max image size is ${maxSizeInMB}MB`);
            return;
        }

        setImage(file);
    };

    const onImageUpload = async event => {
        event.preventDefault();
        if (!image) {
            toast.error('No image chosen');
            return;
        }

        const formData = new FormData(event.target);
        formData.append('file', image);

        const uri = `/owner/restaurants/${restaurantId}/image`;
        const action = async () => axios.post(uri, formData, {
            validateStatus: false,
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Image uploaded')
                history.push('/refresh');
            }
        });
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

/**
 * @param {File} file 
 */
const hasValidSize = file => file.size / 1024 / 1024 < maxSizeInMB;

export default ImageUploader;