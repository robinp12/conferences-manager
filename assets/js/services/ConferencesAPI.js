import axios from 'axios';
import { CONFERENCES_API, PARTICIPANTS_API } from "../config";


function findAllConferences() {
    return axios
        .get(CONFERENCES_API)
        .then(response => response.data["hydra:member"]);
}

function find (id) {
    return axios
        .get(CONFERENCES_API +"/" + id)
        .then(response => response.data);
}

function update(id, conf) {
    return axios
        .put(CONFERENCES_API + "/"+ id, conf)
}

function create(conf) {
    return axios
        .post(CONFERENCES_API, conf)
}

function subscribeConference(participant){
    return axios
        .post(PARTICIPANTS_API, participant)
}

function unSubscribeConference(id) {
    return axios
        .delete(PARTICIPANTS_API + "/" + id);
}
function deleteConference(id) {
    return axios
        .delete(CONFERENCES_API + "/" + id);
}

export default{
    findAllConferences, create,  subscribeConference,
    unSubscribeConference, deleteConference, update, find
}