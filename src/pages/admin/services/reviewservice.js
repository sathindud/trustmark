import axios from 'axios';

const BASE_URL = 'http://localhost:8080/admin/reviews';

export const getAllReviews = () => axios.get(`${BASE_URL}`);
export const approveReview = (id) => axios.put(`${BASE_URL}/${id}/approve`);
export const rejectReview = (id) => axios.put(`${BASE_URL}/${id}/reject`);
export const deleteReview = (id) => axios.delete(`${BASE_URL}/${id}`);
