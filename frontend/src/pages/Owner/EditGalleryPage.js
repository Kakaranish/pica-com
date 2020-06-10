import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import ImageUploader from '../Owner/components/ImageUploader';
import "../../../node_modules/react-image-gallery/styles/css/image-gallery.css";
import "./test.css";
import BasicRestaurantInfo from './components/BasicRestaurantInfo';
import ImagesPreviews from './components/ImagesPreviews';

const EditGalleryPage = ({ match }) => {

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get(`/restaurants/${restaurantId}/pic-urls`,
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, restaurant: result });
            setPictures([...(result.pictures ?? [])]);
        };

        fetch();
    }, []);

    const onImageUploadCb = image => setPictures(pictures => [...pictures, image])

    if (state.loading) return <></>

    return <>
        <BasicRestaurantInfo restaurant={state.restaurant} />

        <ImagesPreviews pictures={pictures}
            restaurantId={restaurantId} />

        <ImageUploader onImageUploadCb={onImageUploadCb}
            restaurantId={restaurantId} />
    </>
};

export default EditGalleryPage;