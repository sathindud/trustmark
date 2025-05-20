import { Route, Routes } from "react-router-dom";
import "./App.css";
import WriteReview from "./pages/review_pages/WriteReview";
import ReviewSummery from "./pages/review_pages/ReviewSummery";
import BusinessList from "./pages/admin/components/BusinessList";
import ReviewList from "./pages/admin/components/ReviewList";

import AddBusiness from "./pages/review_pages/Buisnessregister";
import EditBusiness from "./pages/review_pages/BusinessUpdate";
import BusinessProfile from "./pages/BusinessProfile";

import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Demo from "./pages/DemoPage.tsx";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import Home from "./pages/main/Home";
import SearchResults from "./pages/main/SearchResults.tsx";
import Dashboard from "./pages/DashBoard.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />

        <Route path="/evaluate" element={<WriteReview />} />
        <Route path="/read-review/:businessId" element={<ReviewSummery />} />

        <Route
          path="/edit-business/:id"
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
        <Route path="/businessprofile/:id" element={<BusinessProfile />} />

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

        <Route path="/admin/businesses" element={<BusinessList />} />
        <Route path="/admin/reviews" element={<ReviewList />} />
      </Routes>
    </>
  );
}

export default App;
