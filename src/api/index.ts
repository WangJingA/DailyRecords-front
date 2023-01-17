import request from '../utils/request';
import post from "wangeditor/dist/editor/upload/upload-core";

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};
export const getWeather = () => {
    return request({
        url: '/login/getCheckCode/date='+new Date(),
        // url: '/login/getCheckCode/date='+new Date(),
        method: 'get'
    });
};
export const sendEmailCode = (data) => {
    return request({
        url: '/login/sendRegisCode?email='+data,
        method: 'get',
        data:data
    });
};
export const userLogin = (data) => {
    return request({
        url: '/record/login',
        method: 'post',
        data:data
    });
};