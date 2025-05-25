import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirm = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete("/api/users/delete-account", {
        data: { password },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Account deleted successfully.");
      logout();
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || "Invalid input or session expired.");
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        alert("Something went wrong.");
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-2 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <form onSubmit={handleDelete} className="space-y-4">
          <h2 className="text-2xl font-semibold mb-6 text-center text-red-600">
            Delete Account
          </h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Please enter your password to permanently delete your account.
          </p>

          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Delete My Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;