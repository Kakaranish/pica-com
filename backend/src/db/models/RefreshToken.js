import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
});

const RefreshToken = mongoose.model('refreshToken', schema);

export default RefreshToken;