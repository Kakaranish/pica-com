import { Schema } from 'mongoose';

const LocationSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
});

export default LocationSchema;