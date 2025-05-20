import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface UserProfile {
  id: number | null;
  fullName: string;
  email: string;
  role: string;
  profileImage: string | null;
  password: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get<UserProfile>("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-2 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <div className="flex flex-col items-center">
          {user.profileImage != null && (
            <img
              src={user.profileImage || "https://via.placeholder.com/150"} // If profileImage is null, use placeholder
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
          )}

          <h1 className="text-2xl font-bold mb-2">{user.fullName}</h1>
          <p className="text-gray-500 mb-4">{user.role}</p>
        </div>

        <div className="text-left space-y-2">
          <div>
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl">
            Edit Profile
          </button>
          <button
            className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-xl"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
