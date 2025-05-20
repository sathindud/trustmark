// src/api/auth.ts
import axios from 'axios';

const API = axios.create({
    baseURL: '/api', // Update with your backend URL
    withCredentials: true,
});

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export const loginUser = async (data: LoginRequest) => {
    const response = await API.post('/auth/login', data);
    const token = response.data.token;
    localStorage.setItem("jwt", token);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`; // set for future
    return response;
};

export const registerUser = (data: RegisterRequest) => API.post('/auth/register', data);

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});