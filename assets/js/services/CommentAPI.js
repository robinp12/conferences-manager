import axios from 'axios';
import { COMMENTS_API } from "../config";


function findAll() {
    return axios
        .get(COMMENTS_API)
        .then(response => response.data["hydra:member"]);
}

function newComment(comment){
    return axios
        .post(COMMENTS_API, comment)
}

function deleteComment(id) {
    return axios
        .delete(COMMENTS_API + "/" + id);
}

export default{
    findAll, newComment,  deleteComment
}