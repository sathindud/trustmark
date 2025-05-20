import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Globe, CalendarDays, Layers, Tag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  email: string;
  phoneNumber: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

const BusinessProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axios.get("/api/getbusiness", { params: { id } });
        setBusiness(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch business details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this business?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/deletebusiness/${id}`,{headers :{Authorization: `Bearer ${token}`,}});
      alert("Business deleted successfully.");
      navigate("/addbusiness"); 
    } catch (err) {
      console.error(err);
      alert("Failed to delete the business. Please try again.");
    }
  };

  if (loading) return <div className="text-center text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!business) return <div className="text-center text-gray-600">No business found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c6f0e2] via-[#e4f7dd] to-[#fdfde6] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl bg-white/90 backdrop-blur-sm p-10 border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800">{business.name}</h1>
          <p className="text-gray-600 italic mt-2">{business.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
          <InfoRow icon={<Tag className="text-[var(--color-primary-1)]" />} label="Category" value={business.category} />
          <InfoRow icon={<Layers className="text-[var(--color-primary-1)]" />} label="Email" value={business.email} />
          <InfoRow icon={<Layers className="text-[var(--color-primary-1)]" />} label="Phone Number" value={business.phoneNumber} />
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
          <InfoRow
            icon={<CalendarDays className="text-[var(--color-primary-1)]" />}
            label="Created At"
            value={new Date(business.createdAt).toLocaleString()}
          />
          <InfoRow
            icon={<CalendarDays className="text-[var(--color-primary-1)]" />}
            label="Updated At"
            value={new Date(business.updatedAt).toLocaleString()}
          />
        </div>

        <div className="mt-10 text-center">
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



