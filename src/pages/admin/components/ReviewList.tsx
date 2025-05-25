import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";

type Review = {
  id: number;
  userName: string;
  businessName: string;
  createdAt: string;
  title: string;
  status: string;
};

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    axios
      .get<Review[]>("/api/admin/reviews/all")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleApprove = (id: number) => {
    axios.put(`/api/admin/reviews/${id}/approve`).then(() => fetchReviews());
  };

  const handleReject = (id: number) => {
    axios.put(`/api/admin/reviews/${id}/reject`).then(() => fetchReviews());
  };

  const handleDelete = (id: number) => {
    axios.delete(`/api/admin/reviews/${id}`).then(() => fetchReviews());
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-sm font-semibold";
    switch (status.toUpperCase()) {
      case "APPROVED":
        return (
          <span className={`${base} bg-green-100 text-green-600`}>
            Approved
          </span>
        );
      case "PENDING":
        return (
          <span className={`${base} bg-orange-100 text-orange-600`}>
            Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className={`${base} bg-red-100 text-red-600`}>Rejected</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>
        );
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Reviews</h2>
      </div>

      <table className="min-w-full text-sm text-left border-t">
        <thead>
          <tr className="text-gray-500 uppercase border-b">
            <th className="py-3">Review Title</th>
            <th>Username</th>
            <th>Business ID</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b hover:bg-gray-50">
              <td className="py-4">{review.title}</td>
              <td>{review.userName}</td>
              <td>{review.businessName}</td>
              <td>{review.createdAt.slice(0, 10)}</td>
              <td>{getStatusBadge(review.status)}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleApprove(review.id)}
                  className={`p-2 rounded hover:opacity-80 ${
                    review.status === "APPROVED"
                      ? "bg-gray-300 text-black"
                      : "bg-black text-white"
                  }`}
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => handleReject(review.id)}
                  className={`p-2 rounded hover:opacity-80 ${
                    review.status === "REJECTED"
                      ? "bg-gray-300 text-black"
                      : "bg-black text-white"
                  }`}
                >
                  <FaTimes />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;
