import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Globe, CalendarDays, Layers, Tag, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import ReviewSummery from "./review_pages/ReviewSummery";
import LazyImage from "../components/ImageProp";

interface Business {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
  photo: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  rating?: number; // average rating
  totalReviews?: number;
  addressL1?: string;
  addressL2?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

const BusinessProfile: React.FC = () => {
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!token) {
          setError("No authentication token found.");
          setLoading(false);
          return;
        }
        type JwtPayload = { sub?: string };
        let userEmail = "";
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          userEmail = decoded.sub ?? "";
        } catch (decodeErr) {
          setError("Invalid authentication token.");
          setLoading(false);
          return;
        }
        if (!userEmail) {
          setError("User email not found in token.");
          setLoading(false);
          return;
        }
        const response = await axios.get("/api/getbusiness", {
          params: {
            userEmail,
          },
        });
        setBusiness(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch business details.");
      } finally {
        setLoading(false);
      }
    };

    if (token !== null) {
      fetchBusiness();
    }
  }, [token]);

  const handleDelete = async () => {
    if (!business) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this business?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/deletebusiness/${business.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Business deleted successfully.");
      navigate("/addbusiness");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the business. Please try again.");
    }
  };

  if (loading)
    return <div className="text-center text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!business)
    return <div className="text-center text-gray-600">No business found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c6f0e2] via-[#e4f7dd] to-[#fdfde6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl bg-white/90 backdrop-blur-sm p-10 border border-gray-200">
        <div>
          {business.photo && business.photo !== "" ? (
            <div className="size-10 rounded-3xl">
              <LazyImage imageName={business.photo} alt={business.name} />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800">
            {business.name}
          </h1>
          <p className="text-gray-600 italic mt-2">{business.description}</p>
          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-2xl">&#9733;</span>
              <span className="text-xl font-semibold">
                {business.rating ? business.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-gray-500 ml-1">/ 5</span>
            </div>
            <span>|</span>
            <div className="text-gray-600 text-lg">
              {business.totalReviews ?? 0} Reviews
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
          <InfoRow
            icon={<Layers className="text-[var(--color-primary-1)]" />}
            label="Email"
            value={business.email}
          />
          <InfoRow
            icon={<Layers className="text-[var(--color-primary-1)]" />}
            label="Phone Number"
            value={business.phone}
          />
          <InfoRow
            icon={<Globe className="text-[var(--color-primary-1)]" />}
            label="Website"
            value={
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {business.website}
              </a>
            }
          />
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-start space-x-4">
              <div className="pt-1">
                <Tag className="text-[var(--color-primary-1)]" />
              </div>
              <div>
                <p className="uppercase text-sm font-semibold text-gray-500">
                  Address
                </p>
                <p className="text-base">
                  {business.addressL1}
                  {business.addressL2 && `, ${business.addressL2}`}
                  {business.city && `, ${business.city}`}
                  {business.district && `, ${business.district}`}
                  {business.postalCode && `, ${business.postalCode}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center flex flex-row gap-3">
          <button
            onClick={() => navigate("/edit-business")}
            className="flex items-center justify-center  px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition duration-200"
          >
            Edit Business
          </button>
          <button
            onClick={() => navigate("/read-review/" + business.id)}
            className="flex items-center justify-center  px-6 py-3 rounded-lg shadow hover:bg-gray-300 transition duration-200"
          >
            Reply to reviews
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            <Trash2 className="mr-2" />
            Delete Business
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start space-x-4">
    <div className="pt-1">{icon}</div>
    <div>
      <p className="uppercase text-sm font-semibold text-gray-500">{label}</p>
      <p className="text-base">{value}</p>
    </div>
  </div>
);

export default BusinessProfile;
