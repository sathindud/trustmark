import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

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
    axios.get<Review[]>('http://localhost:8080/api/reviews')
      .then(response => setReviews(response.data))
      .catch(error => console.error(error));
  }, []);

  const refreshData = () => {
    axios.get<Review[]>('http://localhost:8080/api/reviews')
      .then(response => setReviews(response.data));
  };

  const handleApprove = (id: number) => {
    axios.put(`http://localhost:8080/api/reviews/${id}/approve`)
      .then(() => refreshData());
  };

  const handleReject = (id: number) => {
    axios.put(`http://localhost:8080/api/reviews/${id}/reject`)
      .then(() => refreshData());
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:8080/api/reviews/${id}/delete`)
      .then(() => refreshData());
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-sm font-semibold";
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className={`${base} bg-green-100 text-green-600`}>Approved</span>;
      case 'pending':
        return <span className={`${base} bg-orange-100 text-orange-600`}>Pending</span>;
      case 'rejected':
        return <span className={`${base} bg-red-100 text-red-600`}>Rejected</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Reviews</h2>
          <p className="text-sm text-green-500 font-medium">Active Members</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select className="text-sm border border-gray-300 px-3 py-2 rounded-md">
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      <table className="min-w-full text-sm text-left border-t">
        <thead>
          <tr className="text-gray-500 uppercase border-b">
            <th className="py-3">Review Title</th>
            <th>Username</th>
            <th>Business</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.id} className="border-b hover:bg-gray-50">
              <td className="py-4">{review.title}</td>
              <td>{review.userName}</td>
              <td>{review.businessName}</td>
              <td>{review.createdAt.slice(0, 10)}</td>
              <td>{getStatusBadge(review.status)}</td>
              <td className="space-x-2">
                {review.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="bg-black text-white p-2 rounded hover:opacity-80"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleReject(review.id)}
                      className="bg-gray-300 text-black p-2 rounded hover:opacity-80"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
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

      {/* Pagination (static UI only) */}
      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>Showing data 1 to 8 of 256K entries</div>
        <div className="space-x-1">
          <button className="px-2 py-1 border rounded text-purple-600 font-bold">1</button>
          <button className="px-2 py-1 border rounded">2</button>
          <button className="px-2 py-1 border rounded">3</button>
          <span>...</span>
          <button className="px-2 py-1 border rounded">40</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
