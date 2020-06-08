import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from './ImageUploader';
import { requestHandler } from '../common/utils';

const UploadImage = () => {

    const history = useHistory();
    const [file, setFile] = useState(null);
    const onImageChangeCb = file => setFile(file);

    const onSubmit = async event => {
        event.preventDefault();
        if (!file) alert('No image chosen');

        const formData = new FormData(event.target);
        formData.append('file', file);
        
        const action = async () => axios.post('/upload', formData, {
            validateStatus: false,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const result = await requestHandler(action);
        if(!result) return;

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