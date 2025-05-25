import {useState} from "react";
import axios from "axios";
import {useAuth} from "../../context/AuthContext";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const {logout} = useAuth();

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
            const token = localStorage.getItem("jwt");
            await axios.put(
              "/api/users/update-password",
              {
                oldPassword,
                newPassword,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            alert("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            logout();
          }catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              alert(error.response?.data || "Invalid input");
              console.error("Axios error:", error.response?.data || error.message);
            } else {
              alert("Something went wrong");
              console.error("Unexpected error:", error);
            }
          }
        };

    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-2 p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Change Password
            </h2>
            <label className="block text-sm mb-1">Old password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <label className="block text-sm mb-1">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-primary-1 hover:bg-primary-1-hover text-white font-semibold py-2 px-4 rounded-xl"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
};

export default ChangePassword;
