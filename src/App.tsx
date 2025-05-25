import { Route, Routes } from "react-router-dom";
import "./App.css";
import WriteReview from "./pages/review_pages/WriteReview";
import ReviewSummery from "./pages/review_pages/ReviewSummery";
import BusinessList from "./pages/admin/components/BusinessList";
import ReviewList from "./pages/admin/components/ReviewList";
import AdminDashboard from "./pages/admin/components/AdminDashboard";
import AddBusiness from "./pages/review_pages/Buisnessregister";
import EditBusiness from "./pages/review_pages/BusinessUpdate";
import BusinessProfile from "./pages/BusinessProfile";
import UserList from "./pages/admin/components/UserList";

import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Demo from "./pages/DemoPage.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Home from "./pages/main/Home";
import SearchResults from "./pages/main/SearchResults.tsx";
import Dashboard from "./pages/dashboard/DashBoard.tsx";
import EmailVerification from "./pages/EmailVerification.tsx";
import ChangePassword from "./pages/dashboard/ChangePassword.tsx";
import DeleteAccount from "./pages/dashboard/DeleteAccount.tsx";
import CreateAdminAccount from "./pages/admin/components/CreateAdminAccount.tsx";

function App() {
  return (
    <>
      <Routes>
        {/* 
          Review Routes
        */}

        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/evaluate" element={<WriteReview />} />
        <Route path="/read-review/:businessId" element={<ReviewSummery />} />

        {/* 
          Business Routes
        */}
        <Route
          path="/edit-business"
          element={
            <PrivateRoute>
              <EditBusiness />
            </PrivateRoute>
          }
        />
        <Route
          path="/addbusiness"
          element={
            <PrivateRoute>
              <AddBusiness />
            </PrivateRoute>
          }
        />
        <Route path="/businessprofile" element={<BusinessProfile />} />

        {/* 
          User Routes
        */}
        <Route path="/email-verification" element={<EmailVerification />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/demo"
          element={
            <PrivateRoute>
              <Demo />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/delete-account"
          element={
            <PrivateRoute>
              <DeleteAccount />
            </PrivateRoute>
          }
        />

        {/* 
          Admin Routes
          These routes are protected and should only be accessible by admin users.
        */}

        <Route path="/admin/businesses" element={<BusinessList />} />
        <Route path="/admin/reviews" element={<ReviewList />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/create-admin" element={<CreateAdminAccount />} />
      </Routes>
    </>
  );
}

export default App;
