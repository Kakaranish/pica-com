import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    eventId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    header: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: { createdAt: 'createdAt' }
});

const Notification = mongoose.model('notification', schema);

export default Notification;