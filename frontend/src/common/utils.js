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

    handlers = handlers ?? [];
    let handlersDict = Object.assign({}, ...handlers.map(h => ({ [h.status]: h.callback })));

    const result = await action();
    if (result.status === 200) {
        if (handlersDict[200]) return await handlersDict[200](result.data);
        else return result.data ?? true;
    }

    const anyStatus = -1;
    const callbackForAnyStatus = handlersDict[anyStatus];
    if (callbackForAnyStatus) return callbackForAnyStatus(result.data);

    const callback = handlersDict[result.status];
    if (callback) return await callback(result.data);

    document.location = `/error/${result.status}`;
};