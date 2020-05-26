import axios from 'axios';
import usersAPI from "./usersAPI";
import jwtDecode from 'jwt-decode';
import { LOGIN_API, USERS_API } from "../config";


function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function authenticate(credentials){
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token)
        });
}

function getUserInfo(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        const {username: user} = jwtDecode(token);
        return axios
            .get(USERS_API + "?email="+user)
            .then(response => response.data["hydra:member"]);
    }
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function setup(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        setAxiosToken(token);
    }
}

function isAuthenticated(){
    const token = window.localStorage.getItem(("authToken"));

    if (token) {
        return true
    }
    return false
}

export default {
    authenticate, logout, setup, isAuthenticated, getUserInfo, setAxiosToken
};