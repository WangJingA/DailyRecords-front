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
        // url: '/vaildate/getCode/date='+new Date(),
        method: 'get'
    });
};
export const sendEmailCode = ({data}: { data: any }) => {
    return request({
        url: '/record/code?email='+data,
        method: 'post',
        data:data
    });
};
export const userLogin = ({data}: { data: any }) => {
    return request({
        url: '/record/login',
        method: 'post',
        data:data
    });
};
export const register = ({data}: { data: any }) => {
    return request({
        url: '/record/regis',
        method: 'post',
        data: data
    });
};
export const getRecordType = () => {
    return request({
        url: '/record/getRecordType',
        method: 'get',
    });
};