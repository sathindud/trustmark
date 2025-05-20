import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

interface Business {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  verified: boolean;
}

const BusinessList: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const fetchBusinesses = () => {
    axios
      .get<Business[]>("/api/businesses/all")
      .then((res) => setBusinesses(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleApprove = (id: number) => {
    axios
      .put(`/api/businesses/${id}/approve`)
      .then(fetchBusinesses)
      .catch(console.error);
  };

  const handleDisapprove = (id: number) => {
    axios
      .put(`/api/businesses/${id}/disapprove`)
      .then(fetchBusinesses)
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      axios
        .delete(`/api/businesses/${id}/delete`)
        .then(fetchBusinesses)
        .catch(console.error);
    }
  };

  const getStatusBadge = (verified: boolean) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    return verified ? (
      <span className={`${base} bg-green-100 text-green-600`}>Verified</span>
    ) : (
      <span className={`${base} bg-gray-100 text-gray-600`}>Unverified</span>
    );
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
              <th className="px-6">Phone Number</th>
              <th className="px-6">Email</th>
              <th className="px-6">Created At</th>
              <th className="px-6">Status</th>
              <th className="px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{b.name}</td>
                <td className="px-6">{b.phoneNumber}</td>
                <td className="px-6">{b.email}</td>
                <td className="px-6">{b.createdAt.slice(0, 10)}</td>
                <td className="px-6">{getStatusBadge(b.verified)}</td>
                <td className="px-6 flex items-center justify-center gap-2 py-4">
                  {!b.verified ? (
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="bg-black text-white p-2 rounded hover:opacity-80"
                    >
                      <FaCheck size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDisapprove(b.id)}
                      className="bg-gray-300 text-black p-2 rounded hover:opacity-80"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
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
        <div>Showing data 1 to {businesses.length} of {businesses.length} entries</div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 border rounded">&lt;</button>
          <button className="px-3 py-1 bg-purple-500 text-white rounded">1</button>
          <button className="px-2 py-1 border rounded">2</button>
          <button className="px-2 py-1 border rounded">3</button>
          <span className="px-2">...</span>
          <button className="px-2 py-1 border rounded">40</button>
          <button className="px-2 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default BusinessList;
