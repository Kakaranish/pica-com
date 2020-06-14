import { Schema } from 'mongoose';

const ImageSchema = new Schema({
    uri: {
        type: String,
        required: true
    },
    blobName: {
        type: String,
        required: true
    },
    thumbnailUri: {
        type: String,
        required: true
    },
    thumbnailBlobName: {
        type: String,
        required: true
    }
});

export default ImageSchema;