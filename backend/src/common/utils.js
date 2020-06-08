import moment from 'moment';
import mongoose from 'mongoose';
import 'regenerator-runtime';

/**
 * @param {String} datetime 
 * @returns {moment.Moment}
 */
export const parseIsoDatetime = datetime => {
    const isoDatetime = moment.utc(datetime, moment.ISO_8601, true)
    return isoDatetime.isValid()
        ? isoDatetime
        : null;
};

/**
 * 
 * @param {String} objectId 
 * @returns {mongoose.}
 */
export const parseObjectId = objectId => {
    return mongoose.Types.ObjectId.isValid(objectId)
        ? mongoose.Types.ObjectId(objectId)
        : null;
};

/**
 * @async
 * @param {Response} res 
 * @param {Function} action 
 */
export const withAsyncRequestHandler = async (res, action) => {
    try {
        await action();
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ errors: ['Internal error'] });
    }
};

/**
 * @async
 * @param {function: any} action 
 * @param  {Array.<{status: string, function: void}>} handlers 
 * @returns {Promise.<any>} result
 * @example 
 * await requestHandler(
 *  async () => axios.post('/some/uri'/),
 *  {status: 404, callback: async () => console.log('custom 404 error handling')},
 *  {status: 500, callback: async () => {window.location = '/error/500'}},
 * );
 */
export const requestHandler = async (action, ...handlers) => {
    const result = await action();
    if (result.status === 200) return result.data;

    handlers = handlers ?? [];
    let handlersDict = Object.assign({}, ...handlers.map(h => ({ [h.status]: h.callback })));
    
    const handler = handlersDict[result.status];
    if (handler) return await handler.callback();
    
    window.location = `/error/${result.status}`;
}

requestHandler()