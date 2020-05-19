import axios from "axios";
import { MEDECINS_API } from "../config";


function update(id, user){
    return axios.put(MEDECINS_API + "/" + id, user);
}

export default {
    update
}