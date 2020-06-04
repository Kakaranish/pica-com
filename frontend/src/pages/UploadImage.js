import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from './ImageUploader';

const UploadImage = () => {

    const history = useHistory();
    const [file, setFile] = useState(null);
    const onImageChangeCb = file => setFile(file);

    const onSubmit = async event => {
        event.preventDefault();
        if (!file) alert('No image chosen');

        const formData = new FormData(event.target);
        formData.append('file', file);
        
        const result = await axios.post('/upload', formData, {
            validateStatus: false,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (result.status !== 200) {
            alert('Error');
            console.log(result);
            return;
        }

        alert('Ok, image uploaded');
        history.go();
    }

    return <>
        <form onSubmit={onSubmit}>
            <ImageUploader onChange={onImageChangeCb} />

            <button type="submit" className="btn btn-primary btn-block">
                Upload
            </button>
        </form>
    </>
};

export default UploadImage;