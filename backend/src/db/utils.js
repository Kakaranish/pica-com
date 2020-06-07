import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import 'regenerator-runtime';
import User from './models/User';
import { createRefreshToken } from '../auth/utils';

require('dotenv').config();

export const connectDb = async () => {
    await mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};

export const connectTestDb = async () => {
    await mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME_TEST,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};

export const initRootUser = async () => {
    if (await User.exists({ provider: 'CREDENTIALS', providerKey: 'root@pica.com' }))
        return;

    const root = new User({
        provider: 'CREDENTIALS',
        providerKey: 'root@pica.com',
        email: 'root@pica.com',
        password: await bcryptjs.hash(process.env.ROOT_DEFAULT_PASSWORD, 10),
        firstName: 'root',
        lastName: 'root',
        role: 'ADMIN'
    });
    await root.save();
    await createRefreshToken(root.toIdentityJson());
}