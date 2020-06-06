import mongoose from 'mongoose';

require('dotenv').config();

export const connectDb = async () => {
    await mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};