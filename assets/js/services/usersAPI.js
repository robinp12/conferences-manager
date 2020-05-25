import axios from 'axios';
import { USERS_API, URL } from "../config";

function findAll() {
    return axios
        .get(USERS_API)
        .then(response => response.data["hydra:member"]);
}

function find(id) {
    return axios
        .get(USERS_API + "/" + id)
        .then(response => response.data);
}

function create (user){
    return axios
        .post(USERS_API + "/", user);
}

function signUp (user){
    return axios
        .post(URL + "signup", user);
}

function update(id, user){
    return axios.put(USERS_API + "/" + id, user);
}

function deleteUser(id){
    return axios.delete(USERS_API + "/" + id);
}


function findUnaccepted(){
    return axios
        .get(USERS_API + "?isAccepted=false")
        .then(response => response.data["hydra:member"]);
}

function getInfosUser(id){
    return axios.get(URL + "getInfosUser/"+id)
        .then(response => response.data);
}

function postInfosUser(obj){
    return axios.post(URL + "postInfosUser", obj)
}

export default {
    findAll, find, create, update, deleteUser, findUnaccepted, getInfosUser, postInfosUser
}