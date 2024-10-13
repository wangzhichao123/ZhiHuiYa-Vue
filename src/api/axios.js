// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.5.24:9099', // 替换为你的 API 基础 URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 可选：设置请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如，可以添加 Authorization 头部
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 可选：设置响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    return response.data; // 直接返回数据
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default axiosInstance;
