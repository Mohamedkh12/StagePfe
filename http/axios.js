import axios from "axios";
const baseURL = "http://192.168.1.10:3004/";
axios.interceptors.response.use(
    function (response)
    {
        console.log("Response from Axios Service =======>", response);
        return response;
    },
    (error) => {
        const expectedError =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedError) {
            console.log("Error in Axios Service =======>", error);
        }

        return Promise.reject(error);
    }
);

const instance = axios.create({
    baseURL
});


export default {
    get: instance.get,
    post: instance.post,
    put: instance.put,
    delete: instance.delete,
    patch: instance.patch,
};

