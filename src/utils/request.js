import axios from 'axios'
import { ElMessage } from 'element-plus';

//创建一个axios对象出来
const request = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
})

// request 拦截器，可以在请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    // if (localStorage.token) { //判断token是否存在
    //     config.headers['token'] = localStorage.token;  //将token设置成请求头
    // }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器，可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        // response.data即为后端返回的Result
        let res = response.data;
        // 兼容服务端返回的字符串数据
        // if (typeof res === 'string') {
        //     res = res ? JSON.parse(res) : res
        // }
        // 判断响应状态码
        if (res.code !== 200) {
            if (res.code === 501) return Promise.reject(ElMessage.error("邮箱或密码错误"))
            else if (res.code === 503) return Promise.reject(ElMessage.error("邮箱或密码错误"))
            else if (res.code === 504) return Promise.reject(ElMessage.error("登录已过期"))
            else if (res.code === 505) return Promise.reject(ElMessage.error("邮箱已存在"))
            else if (res.code === 506) return Promise.reject(ElMessage.error("注册失败"))
        } 

        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error);
    }
)

export default request