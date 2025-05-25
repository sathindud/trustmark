import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-white">

      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Welcome to Admin Dashboard
      </h1>
      <div className="flex flex-col space-y-6 w-full max-w-xs">
        <button
          onClick={() => navigate("/admin/businesses")}
          className="bg-blue-600 text-white py-3 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Manage Businesses
        </button>
        <button
          onClick={() => navigate("/admin/reviews")}
          className="bg-green-600 text-white py-3 rounded-2xl text-lg font-semibold hover:bg-green-700 transition"
        >
          Manage Reviews
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-purple-600 text-white py-3 rounded-2xl text-lg font-semibold hover:bg-purple-700 transition"
        >
          Manage Users
        </button>
        <button
  onClick={() => navigate("/admin/create-admin")}
  className="bg-red-600 text-white py-3 rounded-2xl text-lg font-semibold hover:bg-red-700 transition"
>
  Create Admin Account
</button>

        
      </div>
    </div>
  );
}

export default AdminDashboard;
