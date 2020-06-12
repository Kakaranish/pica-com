import axios from "axios";
import { requestHandler } from "../../../common/utils";

export const changeStatus = async (restaurantId, status) => {
    const uri = `/owner/restaurants/${restaurantId}/status/${status}`
    const action = async () => axios.put(uri, {}, { validateStatus: false });
    return await requestHandler(action);
};

export const editPrompt = async restaurantId => {
    const confirmText = 'Do you really want to edit this restaurant?\n' +
        'Its status will be changed to DRAFT';
    if (window.confirm(confirmText)) {
        await changeStatus(restaurantId, 'draft');
        return true;
    }
    return false;
}
