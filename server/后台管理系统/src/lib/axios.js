import axios from "axios";
import Qs from "qs"

//自动切换环境
if (process.env.NODE_ENV == 'development') { //开发环境
    axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV == 'debug') {    //测试环境
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {  //生产环境
    // axios.defaults.baseURL = 'http://www.n9.com';
    // axios.defaults.baseURL = 'http://xdp.test';
    axios.defaults.baseURL = 'http://shustudio.51vip.biz';
}
//设置超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//对外接口
// export function request({method, url, params}){
//     if(method == 'get'){
//         return get(url, params);
//     }else if(method == 'post'){
//         return post(url, params);
//     }
// }

// 封装get方法
const get = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    });

}

// 封装post方法
const post = (url, data, config) => {
    if (config) {
        return new Promise((resolve, reject) => {
            axios.post(url, data, config).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
    } else {
        return new Promise((resolve, reject) => {
            axios.post(url, Qs.stringify(data)).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
    }

}
const baseURL = axios.defaults.baseURL;
export default {
    get,
    post,
    baseURL
}