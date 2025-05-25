// src/services/UserService.ts
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const getAllUsers = () => axios.get(`${BASE_URL}/users/all`);
export const approveUser = (id: number) => axios.put(`${BASE_URL}/users/${id}/approve`);
export const rejectUser = (id: number) => axios.put(`${BASE_URL}/users/${id}/reject`);
export const deleteUser = (id: number) => axios.delete(`${BASE_URL}/users/${id}`);
