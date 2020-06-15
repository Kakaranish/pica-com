import mongoose, { Schema } from 'mongoose';

const simplifiedUserSchema = new Schema({
    role: {
        type: String,
        default: 'USER',
        required: true
    }
});

const SimplifiedUser = mongoose.model('user', simplifiedUserSchema);

export default SimplifiedUser;