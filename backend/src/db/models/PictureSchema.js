import { Schema } from 'mongoose';

const PictureSchema = new Schema({
    uri: {
        type: String,
        required: true
    },
    blobName: {
        type: String,
        required: true
    },
    blobContainer: {
        type: String,
        required: true
    }
});

export default PictureSchema;