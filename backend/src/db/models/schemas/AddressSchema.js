import { Schema } from 'mongoose';

const AddressSchema = new Schema({
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
    flatCode: {
        type: String,
        required: false
    },
    isDefault: {
        type: Boolean,
        required: true,
        default: true
    }
});

export default AddressSchema;