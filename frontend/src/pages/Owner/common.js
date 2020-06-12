import axios from "axios";
import { requestHandler } from "../../common/utils";

export const changeStatus = async (restaurantId, status) => {
    const uri = `/owner/restaurants/${restaurantId}/status/${status}`
    const action = async () => axios.put(uri, {}, { validateStatus: false });
    return await requestHandler(action);
};