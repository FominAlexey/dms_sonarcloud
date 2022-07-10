import Axios, { AxiosResponse } from 'axios';
import { removeUserInfo } from 'src/shared/LocalStorageUtils';

type responseTypes = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream' | undefined;

function configAxios() {
    Axios.defaults.withCredentials = true;

    Axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response.status === 401) {
                removeUserInfo();
                window.location.href = '/Login';
            } else {
                return Promise.reject(error);
            }
        },
    );
}

export default {
    // setHeader(responseType?: responseTypes) {
    //     Axios.defaults.headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Basic ' + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(getEmail() + ":" + getPassword()))
    //     };

    //     Axios.defaults.auth = { username: getEmail(), password: getPassword() };

    //     if(responseType)
    //         Axios.defaults.responseType = responseType;
    // },

    get(url: string, responseType?: responseTypes): Promise<AxiosResponse> {
        configAxios();

        if (Axios.defaults.responseType === 'blob') Axios.defaults.responseType = 'json';

        if (responseType) Axios.defaults.responseType = responseType;

        return new Promise((resolve, reject) => {
            Axios.get(url)
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    },

    post(url: string, data?: any): Promise<AxiosResponse> {
        configAxios();

        return new Promise((resolve, reject) => {
            Axios.post(url, data)
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    },

    put(url: string, data?: any): Promise<AxiosResponse> {
        configAxios();

        return new Promise((resolve, reject) => {
            Axios.put(url, data)
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    },

    delete(url: string): Promise<AxiosResponse> {
        configAxios();

        return new Promise((resolve, reject) => {
            Axios.delete(url)
                .then(response => resolve(response))
                .catch(err => reject(err));
        });
    },
};
