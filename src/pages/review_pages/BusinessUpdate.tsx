import axios from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Globe, Building, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface Business {
  id: number;
  name: string;
  description: string;
  email: string;
  website: string;
  phone: string;
  addressL1?: string;
  addressL2?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

export default function EditBusiness() {
  const { token } = useAuth();

  const [business, setBusiness] = useState<Business>({
    id: 0,
    name: "",
    description: "",
    email: "",
    website: "",
    phone: "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (!token) {
          setError("No authentication token found.");
          return;
        }
        type JwtPayload = { sub?: string };
        let userEmail = "";
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          userEmail = decoded.sub ?? "";
        } catch (decodeErr) {
          setError("Invalid authentication token.");
          return;
        }
        if (!userEmail) {
          setError("User email not found in token.");
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
      }
    };

    fetchBusiness();
  }, [token]);

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    try {
      await axios.post("/api/updatebusiness ", JSON.stringify(business), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.href = `/businessprofile/${business.id}`;
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };
  <div className="relative"></div>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8D5] to-[#E9F1DF] font-['Roboto'] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-[#205781] mb-8 flex items-center justify-center gap-2">
          <Pencil className="w-8 h-8 text-[#4F959D]" /> Edit Business Details
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6 text-center shadow-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              name: "name",
              label: "Business Name",
              icon: <Building className="w-5 h-5 text-[#4F959D]" />,
            },
            {
              name: "email",
              label: "Email",
              icon: <FileText className="w-5 h-5 text-[#4F959D]" />,
            },
            {
              name: "website",
              label: "Website",
              icon: <Globe className="w-5 h-5 text-[#4F959D]" />,
            },
            {
              name: "phone",
              label: "Phone Number",
              icon: <FileText className="w-5 h-5 text-[#4F959D]" />,
            },
          ].map(({ name, label, icon }) => (
            <div key={name} className="relative">
              <label
                htmlFor={name}
                className="block text-[#205781] font-medium mb-1"
              >
                {label}
              </label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-[#4F959D]">
                {icon}
                <input
                  type="text"
                  id={name}
                  name={name}
                  value={business[name as keyof Business] as string}
                  onChange={onInputChange}
                  className="w-full ml-2 outline-none text-gray-800"
                  required
                />
              </div>
            </div>
          ))}

          {/* Location fields */}
          <div className="relative">
            <label
              htmlFor="addressL1"
              className="block text-[#205781] font-medium mb-1"
            >
              Address Line 1
            </label>
            <input
              type="text"
              id="addressL1"
              name="addressL1"
              value={business.addressL1 || ""}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] text-gray-800"
              placeholder="Street address, P.O. box, company name, c/o"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="addressL2"
              className="block text-[#205781] font-medium mb-1"
            >
              Address Line 2
            </label>
            <input
              type="text"
              id="addressL2"
              name="addressL2"
              value={business.addressL2 || ""}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] text-gray-800"
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
          <div className="relative">
            <label
              htmlFor="city"
              className="block text-[#205781] font-medium mb-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={business.city || ""}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] text-gray-800"
              placeholder="City"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="district"
              className="block text-[#205781] font-medium mb-1"
            >
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={business.district || ""}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] text-gray-800"
              placeholder="District"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="postalCode"
              className="block text-[#205781] font-medium mb-1"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={business.postalCode || ""}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] text-gray-800"
              placeholder="Postal Code"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-[#205781] font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={business.description}
              onChange={onInputChange}
              rows={5}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F959D] resize-none text-gray-800"
              placeholder="Describe your business, services, goals..."
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="bg-[#205781] hover:bg-[#184568] text-white font-semibold py-2 px-6 rounded shadow-md transition-all"
              onClick={() => onSubmit()}
            >
              Update
            </button>

            <Link
              to="/home"
              className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-6 rounded border border-red-300 transition-all"
              role="button"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
