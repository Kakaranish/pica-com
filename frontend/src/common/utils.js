export const getFormDataJsonFromEvent = event => {
    const formData = new FormData(event.target);

    let formDataJson = {};
    for (const [key, value] of formData.entries()) {
        formDataJson[key] = value;
    }

    return formDataJson;
}

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
};