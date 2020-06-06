import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: moment.utc().toDate(),
        required: true
    },
    isRead: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Notification = mongoose.model('notification', schema);

export default Notification;