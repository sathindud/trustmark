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
import { jwtDecode } from "jwt-decode";
import CategorySelector, { Category } from "./components/CategorySelectorProps";

interface Business {
  userEmail: string;
  name: string;
  description: string;
  category: Category[];
  email: string;
  website: string;
  phone: string;
  photo: string;
  addressL1: string;
  addressL2: string;
  city: string;
  district: string;
  postalCode: string;
}

interface JwtPayload {
  sub: string; // or 'email' or 'id' depending on your token
  role?: string;
  exp?: number;
}

export default function AddBusiness() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [business, setBusiness] = useState<Business>({
    userEmail: user?.sub || "",
    name: "",
    description: "",
    category: [],
    email: "",
    website: "",
    phone: "",
    photo: "",
    addressL1: "",
    addressL2: "",
    city: "",
    district: "",
    postalCode: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [businessCategories, setBusinessCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (user === null) {
      fetchUser();
    }
    console.log("User ID:", user?.sub);
  }, [token]);

  const fetchUser = () => {
    if (token) {
      const role = localStorage.getItem("role");
      if (role === "BUSINESS") {
        navigate("/businessprofile");
        return;
      } else {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser(decoded);
        console.log("Decoded user data:", decoded);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/home/categories");
      console.log("Categories:", response.data);
      setCategories(response.data);
    } catch (error) {
      setError("Failed to fetch data");
    }
  };

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = business;

    if (user === null) {
      console.error("User is not authenticated");
    } else {
      data.userEmail = user.sub;
    }

    if (businessCategories.length > 0) {
      data.category = businessCategories;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadStatus("Uploading...");
      try {
        const response = await axios.post("api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        data.photo = response.data; // Assuming the server returns the file URL
        setUploadStatus(`File uploaded successfully: ${response.data}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        if (axios.isAxiosError(error)) {
          setUploadStatus(`Error: ${error.response?.data || error.message}`);
        } else {
          setUploadStatus("Error uploading file");
        }
      }
    }

    console.log("Form data:", JSON.stringify(data));
    try {
      const response = await axios.post(
        "/api/savebusiness",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Failed to create business");
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
            // { name: "category", label: "Category", type: "text" },
            { name: "email", label: "Email", type: "text" },
            { name: "website", label: "Website", type: "text" },
            { name: "phone", label: "Phone Number", type: "text" },
            { name: "addressL1", label: "Address Line 1", type: "text" },
            { name: "addressL2", label: "Address Line 2", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "district", label: "District", type: "text" },
            { name: "postalCode", label: "Postal Code", type: "text" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-[var(--color-primary-1)] font-medium mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={business[name as keyof Business] as string}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-2)]"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <h2 className="text-[var(--color-primary-1)] font-medium mb-2">
              Business Categories
            </h2>
            {categories.length > 0 ? (
              <CategorySelector
                allCategories={categories}
                onCategoriesChange={setBusinessCategories}
              />
            ) : (
              <p>Loading categories...</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-[var(--color-primary-1)] font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={business.description}
              onChange={onInputChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-2)] resize-none"
              required
            />
          </div>

          <div className="p-4 border rounded-md w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">Upload an Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <div className="mt-4">
                <p className="mb-2">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[var(--color-primary-1)] hover:bg-[var(--color-primary-1-hover)] text-white font-medium py-2 px-6 rounded"
            >
              Submit
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
