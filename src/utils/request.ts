import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import router from "../router";

const service:AxiosInstance = axios.create({
    baseURL:'/api',
    withCredentials : true,
    timeout: 5000,
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (localStorage.getItem("token")){
            if (!config) {
                config = {};
            }
            if (!config.headers) {
                config.headers = {};
            }
            config.headers['token']  = localStorage.getItem("token")
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        }else if(response.status === 401){
            localStorage.removeItem('token');
            router.replace({
                path: '/login',
                // query: {
                //     redirect: router.currentRoute.fullPath  //登录成功后跳入浏览的当前页
                // }
            })
        }
        else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
