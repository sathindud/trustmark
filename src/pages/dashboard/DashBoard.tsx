import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LockClosedIcon,
  UserCircleIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import LazyImage from "../../components/ImageProp";
import empty_profile_photo from "../../assets/review_assets/empty_profile_photo.png";

interface UserProfile {
  id: number | null;
  fullName: string;
  email: string;
  role: string;
  profileImage: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);

      if (user === null) {
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.post("api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        handleSubmit(response.data); // Assuming the server returns the file URL
        alert("Profile Photo Uploaded successfully !!");
      } catch (error) {
        console.error("Error uploading file:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleSubmit = async (file: string) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        "/api/users/update-profile",
        {
          email: user?.email,
          photo: file,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || "Invalid input");
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        alert("Something went wrong");
        console.error("Unexpected error:", error);
      }
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="pt-7 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-16 md:top-0 left-0 z-40 h-[calc(100vh-4rem)] md:h-screen w-64 bg-white shadow-md p-6 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div>
            <div className="text-xl font-bold mb-8">Dashboard</div>
            <nav className="space-y-4">
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-700" />
                Profile
              </Link>
              <Link
                to="/dashboard/change-password"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                <LockClosedIcon className="h-5 w-5 text-gray-700" />
                Change Password
              </Link>
              <Link
                to="/dashboard/delete-account"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <UserMinusIcon className="h-5 w-5 text-red-600" />
                Delete Account
              </Link>
            </nav>
          </div>
        </aside>

        {/* Mobile menu button */}
        <div className="md:hidden fixed top-16 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-800 bg-white p-2 rounded-md shadow-md"
          >
            ☰
          </button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold mb-6">
            Welcome, {user.fullName} 👋
          </h1>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
            <label className="cursor-pointer flex-shrink-0 flex flex-col items-center">
              {previewUrl ? (
                <img
                  className="size-20 rounded-full object-cover"
                  src={previewUrl}
                  alt="Profile Preview"
                />
              ) : user.profileImage && user.profileImage !== "" ? (
                <div className="size-20">
                  <LazyImage
                    imageName={user.profileImage}
                    alt={user.profileImage}
                  />
                </div>
              ) : (
                <img className="size-20" src={empty_profile_photo} alt="" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={uploadProfileImage}
                className="hidden"
              />
              <span className="text-sm text-blue-600 mt-2">Edit Photo</span>
            </label>

            <div>
              <p className="text-lg">
                <span className="font-semibold">Full Name:</span>{" "}
                {user.fullName}
              </p>
              <p className="text-lg mt-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-lg mt-2">
                <span className="font-semibold">Role:</span> {user.role}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
