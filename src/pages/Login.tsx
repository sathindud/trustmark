import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.ts";
import AuthForm from "./components/AuthForm.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const res = await loginUser(formData);
      const token = res.data.token;
      login(token);

      // Check if the user drafted a review
      // If so, navigate to the review evaluation page
      const savedReview = localStorage.getItem("review");
      if (savedReview) {
        const review = JSON.parse(savedReview);
        const businessId = review.businessId;
        window.location.replace(`/evaluate?business_id=${businessId}`);
      } else {
        navigate("/dashboard");
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-2">
      <div>
        <AuthForm onSubmit={handleLogin} />
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary-2 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
