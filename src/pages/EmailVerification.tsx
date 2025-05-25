import { useState } from "react";
import axios, { AxiosError } from "axios";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/auth/email-verification", { email });
      setSubmitted(true);
    } catch (err) {
      const error = err as AxiosError;

      const message =
        error.response?.data && typeof error.response.data === "string"
          ? error.response.data
          : error.message ||
            "Failed to send verification email. Please try again.";

      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary-2">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
        {submitted ? (
          <p className="text-center text-green-600">
            ✅ Verification link sent to <strong>{email}</strong>. Please check
            your inbox.
          </p>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Enter your email
            </h2>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-primary-1 hover:bg-primary-1-hover text-white font-semibold py-2 px-4 rounded-xl"
            >
              Send Verification Link
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        )}
        <p className="text-sm text-center mt-4">
          Already verified?{" "}
          <a href="/register" className="text-primary-2 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerification;
