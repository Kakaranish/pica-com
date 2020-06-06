import mongoose from 'mongoose';
import { connectTestDb } from '../src/db/utils';
import * as Common from './common';
import { createRefreshToken } from '../src/auth/utils';

require('dotenv').config();

(async () => {
    await connectTestDb();
    await mongoose.connection.dropDatabase();

    // ---  POPULATE COMMON  ---------------------------------------------------

    await Common.credentialsUser.save();
    await createRefreshToken(Common.credentialsUser.toIdentityJson());
    await Common.googleUser.save();
    await createRefreshToken(Common.googleUser.toIdentityJson());
    await Common.facebookUser.save();
    await createRefreshToken(Common.facebookUser.toIdentityJson());
    await Common.admin.save();
    await createRefreshToken(Common.admin.toIdentityJson());
    await Common.owner.save();
    await createRefreshToken(Common.owner.toIdentityJson());

    await mongoose.connection.close();
    const dbName = process.env.DB_NAME_TEST;
    console.log(`OK - '${dbName}' has been populated.`);
})();