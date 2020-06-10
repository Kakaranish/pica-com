import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import BasicRestaurantInfo from './components/BasicRestaurantInfo';
import ImagesPreviews from './components/GalleryPage/ImagesPreviews';
import ImageUploader from '../Owner/components/GalleryPage/ImageUploader';

const EditGalleryPage = ({ match }) => {

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const uri = `/restaurants/${restaurantId}/images`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const result = await requestHandler(action);

            setState({ loading: false, restaurant: result });
            setImages([...(result.images ?? [])]);
        };

        fetch();
    }, []);

    if (state.loading) return <></>

    return <>
        <BasicRestaurantInfo restaurant={state.restaurant} />

        <ImagesPreviews images={images} restaurantId={restaurantId} />

        {
            images?.length < 5
                ? <ImageUploader restaurantId={restaurantId} />
                : <>
                    <p>You have reached max number of images in gallery</p>
                </>
        }
    </>
};

export default EditGalleryPage;