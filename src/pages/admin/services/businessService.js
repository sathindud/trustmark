import axios from "axios";

const BASE_URL = "http://localhost:8080/api/admin";

export const getAllBusinesses = () => axios.get(`${BASE_URL}/businesses/all`);
export const approveBusiness = (id) => axios.put(`${BASE_URL}/businesses/${id}/approve`);
export const disapproveBusiness = (id) => axios.put(`${BASE_URL}/businesses/${id}/reject`);
export const deleteBusiness = (id) => axios.delete(`${BASE_URL}/businesses/${id}`);
