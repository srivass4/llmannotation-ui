import axios from 'axios';

// Create an axios instance
const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use((config) => {
    // Do something before request is sent
    const token = JSON.parse(localStorage.getItem('token')); // Replace with your token retrieval logic
    config.headers.Authorization = `bearer ${token}`;
    return config;
  }, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

export default instance;