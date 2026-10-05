import { api } from "./api";

const API = "/api/tags";


export function getTags() {

    return api(API);

}


export function getTag(id) {

    return api(`${API}/${id}`);

}


export function createTag(tag) {

    return api(API, {

        method: "POST",

        body: tag

    });

}


export function updateTag(id, tag) {

    return api(`${API}/${id}`, {

        method: "PUT",

        body: tag

    });

}


export function deleteTag(id) {

    return api(`${API}/${id}`, {

        method: "DELETE"

    });

}