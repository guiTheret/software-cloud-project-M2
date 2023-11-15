import axios from 'axios';

const url = "http://localhost:3030";

class api {
    constructor() {
        this.token = "";
    }

    get(path) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + path, { withCredentials: true });
                resolve(res);
            } catch (e) {
                reject(e);
            }
        });
    }

    post(path, body) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url + path, body, { withCredentials: true });
                resolve(res);
            } catch (e) {
                reject(e.response.data);
            }
        });
    }
}

const API = new api();
export default API;
