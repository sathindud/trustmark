import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

interface User {
  id: number;
  fullName: string;
  email: string;
  createAt: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    axios
      .get<User[]>("/api/admin/users/all")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = (id: number) => {
    axios
      .put(`/api/admin/users/${id}/approve`)
      .then(fetchUsers)
      .catch((error) => console.error("Approval failed:", error));
  };

  const handleReject = (id: number) => {
    axios
      .put(`/api/admin/users/${id}/reject`)
      .then(fetchUsers)
      .catch((error) => console.error("Rejection failed:", error));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`/api/admin/users/${id}`)
        .then(fetchUsers)
        .catch((error) => console.error("Deletion failed:", error));
    }
  };

  const getStatusBadge = (status: "PENDING" | "VERIFIED" | "REJECTED") => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "VERIFIED":
        return (
          <span className={`${base} bg-green-100 text-green-600`}>
            VERIFIED
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
    <div className="p-8 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Users</h2>
          <p className="text-green-500 text-sm font-medium">
            Pending/Active Users
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border-t">
          <thead>
            <tr className="text-gray-400 uppercase text-xs border-b">
              <th className="py-3 px-6">Name</th>
              <th className="px-6">Email</th>
              <th className="px-6">Created At</th>
              <th className="px-6">Status</th>
              <th className="px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{u.fullName}</td>
                <td className="px-6">{u.email}</td>
                <td className="px-6">{u.createAt?.slice(0, 10) || "N/A"}</td>
                <td className="px-6">{getStatusBadge(u.verificationStatus)}</td>
                <td className="px-6 flex items-center justify-center gap-2 py-4">
                  <button
                    onClick={() => handleApprove(u.id)}
                    className={`p-2 rounded hover:opacity-80 ${
                      u.verificationStatus === "VERIFIED"
                        ? "bg-gray-300 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={() => handleReject(u.id)}
                    className={`p-2 rounded hover:opacity-80 ${
                      u.verificationStatus === "REJECTED"
                        ? "bg-gray-300 text-black"
                        : "bg-black text-white"
                    }`}
                  >
                    <FaTimes size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
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
        <div>Showing {users.length} entries</div>
      </div>
    </div>
  );
};

export default UserList;
