import axios from "axios";
import { useState, ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Business {
  userId: number;
  name: string;
  description: string;
  category: string;
  email: string;
  website: string;
  verified: number | null;
  verifiedAt: string;
  verificationStatus: string;
  subscriptionTier: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  phone: string;
}

export default function AddBusiness() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business>({
    userId: 1,
    name: "",
    description: "",
    category: "",
    email: "",
    website: "",
    verified: null,
    verifiedAt: "",
    verificationStatus: "",
    subscriptionTier: "",
    createdAt: null,
    updatedAt: null,
    phone: "",
  });

  // const [file, setFile] = useState<File | null>(null);
  // const [filePreview, setFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const now = new Date();
    setBusiness((prev) => ({ ...prev, createdAt: now, updatedAt: now }));
  }, []);

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  // const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const selectedFile = e.target.files[0];
  //     const isImage = selectedFile.type.startsWith("image/");
  //     const isValidSize = selectedFile.size <= 5 * 1024 * 1024;

  //     if (!isImage) {
  //       setError("Only image files are allowed.");
  //       setFile(null);
  //       setFilePreview(null);
  //       return;
  //     }

  //     if (!isValidSize) {
  //       setError("File size must be 5MB or less.");
  //       setFile(null);
  //       setFilePreview(null);
  //       return;
  //     }

  //     setError(null);
  //     setFile(selectedFile);
  //     setFilePreview(URL.createObjectURL(selectedFile));
  //   }
  // };

  const onSubmit = async () => {
    try {
      await axios.post("/api/savebusiness", JSON.stringify(business), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex font-[var(--font-roboto)]">
      <div className="hidden lg:flex flex-col justify-center bg-[var(--color-secondary-2)] w-1/2 p-12 relative">
        <div className="absolute inset-0 bg-[var(--color-secondary-1)] clip-triangle opacity-25" />

        <div className="flex items-start gap-4 mb-6">
          <CheckCircle className="text-[var(--color-primary-1)] w-6 h-6 mt-1" />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-primary-1)] mb-1">
              Build credibility with reviews
            </h1>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <ShieldCheck className="text-[var(--color-primary-1)] w-6 h-6 mt-1" />
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-primary-1)]">
              Strengthen your reputation
            </h1>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <TrendingUp className="text-[var(--color-primary-1)] w-6 h-6 mt-1" />
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-primary-1)]">
              Grow performance
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white p-10 shadow-2xl rounded-l-3xl">
        <h2 className="text-3xl font-bold text-center text-[var(--color-primary-1)] mb-8">
          Business Sign Up
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { name: "name", label: "Business Name", type: "text" },
            { name: "category", label: "Category", type: "text" },
            { name: "email", label: "Email", type: "text" },
            { name: "website", label: "Website", type: "text" },
            { name: "phone", label: "Phone Number", type: "text" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-[var(--color-primary-1)] font-medium mb-1"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={business[name as keyof Business] as string}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-2)]"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-[var(--color-primary-1)] font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={business.description}
              onChange={onInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-2)] resize-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="certificate"
              className="block text-[var(--color-primary-1)] font-medium mb-1"
            >
              Business Verification Certificate
            </label>
            <label
              htmlFor="certificate-upload"
              className="flex items-center justify-center gap-2 bg-[var(--color-primary-1)] hover:bg-[var(--color-primary-1-hover)] text-white font-medium py-3 px-6 rounded cursor-pointer shadow"
            >
              <UploadCloud className="w-5 h-5" /> Upload Image
            </label>
            <input
              type="file"
              id="certificate-upload"
              accept="image/*"
              className="hidden"
              required
            />
            {/* <div className="mt-3 text-sm text-gray-700">
              <p className="font-medium">{file?.name || "No file selected."}</p>
              {filePreview && (
                <div className="mt-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="h-32 rounded-lg border border-gray-300 object-contain"
                  />
                </div>
              )}
            </div> */}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onSubmit}
              className="bg-[var(--color-primary-1)] hover:bg-[var(--color-primary-1-hover)] text-white font-medium py-2 px-6 rounded"
            >
              Save
            </button>
            <Link
              to="/home"
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-6 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
