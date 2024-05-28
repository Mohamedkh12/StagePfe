
import axios from "./axios";

const serverURL="http://192.168.1.10:3005/";
async function axiosRequestGet(service, params) {
    try {
        const baseURL = serverURL + service;
        return axios.get(baseURL, params);
    } catch (e) {
        throw e;
    }
}

async function axiosRequestPost(service, params) {
    try {
        const baseURL = serverURL + service;
        console.log(baseURL, params);
        const response = await axios.post(baseURL, params);
        console.log(response);
        return response;
    } catch (error) {
        console.log("axiosRequestPost", error);
        return error.response;
    }
}

async function axiosRequestPatch(service, params, token) {
    try {
        const baseURL = serverURL + service;
        const response = await axios.patch(baseURL, params, {
            headers: {
                Authorization: `Bearer ${token}` ,
                "Content-Type": 'multipart/form-data'
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
}
async function axiosRequestPostWithToken(service, params, token) {
    try {
        const baseURL = serverURL + service;
        const response = await axios.post(baseURL, params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}
async function axiosRequestGetWithToken(service, token) {
    try {
        const baseURL = serverURL + service;
        const response = await axios.get(baseURL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}
async function axiosRequestPut(service, params) {
    try {
        const baseURL = serverURL + service;
        return await axios.put(baseURL, params);
    } catch (e) {
        throw e;
    }
}

async function axiosRequestDelete(service, token) {
    try {
        const baseURL = serverURL + service;
        const response = await axios.delete(baseURL, {
            data: {
                type: "deleted",
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error?.response;
    }
}

export const axiosProvider = {
    get: axiosRequestGet,
    post: axiosRequestPost,
    put: axiosRequestPut,
    delete: axiosRequestDelete,
    patch: axiosRequestPatch,
    postWithToken: axiosRequestPostWithToken,
    getWithToken: axiosRequestGetWithToken,
};