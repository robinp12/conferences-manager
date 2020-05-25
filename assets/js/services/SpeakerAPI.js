import axios from 'axios';
import {CONFERENCES_API, SPEAKERS_API} from "../config";

function findAll() {
    return axios
        .get(SPEAKERS_API)
        .then(response => response.data["hydra:member"]);
}

function create(speaker){
    return axios
        .post(SPEAKERS_API, speaker)
}

function deleteSpeaker(id) {
    return axios
        .delete(SPEAKERS_API +"/" + id);
}

function confSpeakers(idConf) {
    return axios
        .get(CONFERENCES_API+ "/"+ idConf + "/speakers")
        .then(response => response.data["hydra:member"]);
}

export default{
    findAll, create,  deleteSpeaker, confSpeakers
}