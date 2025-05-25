import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

interface Category {
  id: number;
  types: string;
}
interface Business {
  id: number;
  name: string;
  categories: Category[];
  website: string;
  createdAt: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
}

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const fetchBusinesses = () => {
    axios
      .get<Business[]>("/api/admin/businesses/all")
      .then((res) => setBusinesses(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleApprove = (id: number) => {
    axios
      .put(`/api/admin/businesses/${id}/approve`)
      .then(fetchBusinesses)
      .catch(console.error);
  };

  const handleReject = (id: number) => {
    axios
      .put(`/api/admin/businesses/${id}/reject`)
      .then(fetchBusinesses)
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      axios
        .delete(`/api/admin/businesses/${id}`)
        .then(fetchBusinesses)
        .catch(console.error);
    }
  };

  const getStatusBadge = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "APPROVED":
        return (
          <span className={`${base} bg-green-100 text-green-600`}>
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className={`${base} bg-red-100 text-red-600`}>Rejected</span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>Pending</span>
        );
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Businesses</h2>
          <p className="text-green-500 text-sm font-medium">Active Members</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <select className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-t">
          <thead>
            <tr className="text-gray-400 uppercase text-xs border-b">
              <th className="py-3 px-6">Business Name</th>
              <th className="px-6">Categories</th>
              <th className="px-6">Website</th>
              <th className="px-6">Created At</th>
              <th className="px-6">Status</th>
              <th className="px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">
                  <a href={`/businessprofile/${b.id}`}>{b.name}</a>
                </td>
                <td className="px-6">
                  {b.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mr-2 mb-1"
                    >
                      {cat.types}
                    </span>
                  ))}
                </td>
                <td className="px-6">{b.website}</td>
                <td className="px-6">{b.createdAt.slice(0, 10)}</td>
                <td className="px-6">{getStatusBadge(b.verificationStatus)}</td>
                <td className="px-6 flex items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => handleApprove(b.id)}
                    className={`p-2 rounded hover:opacity-80 ${
                      b.verificationStatus === "APPROVED"
                        ? "bg-gray-300 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={() => handleReject(b.id)}
                    className={`p-2 rounded hover:opacity-80 ${
                      b.verificationStatus === "REJECTED"
                        ? "bg-gray-300 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    <FaTimes size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
        <div>Showing {businesses.length} entries</div>
      </div>
    </div>
  );
};

export default BusinessList;
