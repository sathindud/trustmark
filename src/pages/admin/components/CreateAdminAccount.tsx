import React, { useState } from "react";
import axios from "axios";

const CreateAdminAccount: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/account/create", {
        fullName,
        email,
        password,
      });
      setMessage("Admin account created successfully!");
    } catch (error: any) {
      setMessage(error.response?.data || "Failed to create admin account");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-2">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-center mb-4">
          Create Admin Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create Admin
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
        <p className="text-sm text-center mt-4">
          Already have an admin?{" "}
          <a href="/login" className="text-primary-2 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAdminAccount;
