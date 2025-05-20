import DatePicker from "react-datepicker";
import empty_profile_photo from "../../assets/review_assets/empty_profile_photo.png";
import rate_star from "../../assets/review_assets/favorite.png";
import black_star from "../../assets/review_assets/unfavorite.png";

import "react-datepicker/dist/react-datepicker.css";
import { use, useEffect, useState } from "react";
import axios from "axios";
import ErrorComponent from "./components/ErrorComponent";
import SuccessMessage from "./components/SuccessMessage";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // or 'email' or 'id' depending on your token
  role?: string;
  exp?: number;
}

interface BusinessProps {
  buisnessId: number;
  businessName: string;
  businessWebsite: string;
  businessLogo: string | null;
}

interface ReviewProps {
  title: string;
  content: string;
  rating: number;
  createdAt: Date;
  businessId: string;
  userEmail: string;
  isVerifiedPurches: "no" | "yes" | "pending";
}

function WriteReview() {
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { token } = useAuth();
  const [user, setUser] = useState<JwtPayload | null>(null);

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [business, setBusiness] = useState<BusinessProps | null>(null);
  const [review, setReview] = useState<ReviewProps>({
    title: "",
    content: "",
    rating: 0,
    createdAt: new Date(),
    businessId: "",
    userEmail: "",
    isVerifiedPurches: "no",
  });
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    content?: string;
    rating?: string;
  }>({});

  /**
   * Get the business id from the url
   */

  const location = useLocation();
  const [businessIdFromUrl, setBusinessIdFromUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setBusinessIdFromUrl(searchParams.get("business_id"));
  }, [location]);

  useEffect(() => {
    if (businessIdFromUrl) {
      fetchBusiness(businessIdFromUrl);
    }
  }, [businessIdFromUrl]);

  const fetchBusiness = async (businessId: string) => {
    setError(null);
    try {
      const response = await axios.get("/api/getbusinessreviews", {
        params: {
          business_id: businessId,
        },
      });
      const businessData: BusinessProps = {
        buisnessId: response.data.id,
        businessName: response.data.name,
        businessWebsite: response.data.website,
        businessLogo: null,
      };
      setBusiness(businessData);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError("API Gateway error");
    }
  };

  useEffect(() => {
    fetchUser();

    console.log("User ID:", user?.sub);
  }, [token]);

  const fetchUser = () => {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
      console.log("Decoded user data:", decoded);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const draftReview = localStorage.getItem("review");
    if (draftReview) {
      const r = JSON.parse(draftReview);
      setReview(r);
      setSelectedRating(r.rating);
      localStorage.removeItem("review");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (star: number) => {
    setSelectedRating(star);
    setReview({ ...review, rating: star });
  };

  /**
   * submit the review to the server
   * @param e
   */
  const handelSubmit = async () => {
    console.log("Review data:", review);

    if (!validateReview()) {
      return;
    }

    if (!businessIdFromUrl) {
      alert("Business is not set");
      return;
    }

    let finalReview: ReviewProps = {
      ...review,
      businessId: businessIdFromUrl,
    };

    if (!user) {
      alert("Please login to submit your review");
      handleLogin(finalReview);
      return;
    }

    // Set user email before submitting
    finalReview = { ...finalReview, userEmail: user.sub };

    try {
      const response = await axios.post(
        "/api/evaluvate",
        JSON.stringify(finalReview),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("API Gateway error");
    }
  };

  /**
   * Handle User Login If User is not logged in
   */
  const handleLogin = (r: ReviewProps) => {
    // Save the current form data to localStorage
    localStorage.setItem("review", JSON.stringify(r));
    window.location.href = "/login";
  };

  /**
   * Validation for the review
   */
  const validateReview = (): boolean => {
    const errors: { title?: string; content?: string; rating?: string } = {};
    if (!review.title.trim()) {
      errors.title = "Title is required.";
    }
    if (!review.content.trim()) {
      errors.content = "Content is required.";
    }
    if (review.rating === 0) {
      errors.rating = "Rating is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Show the success message
   */
  if (showSuccessMessage) {
    return (
      <SuccessMessage navigateTo={`/read-review/${business?.buisnessId}`} />
    );
  }

  if (error) {
    return ErrorComponent(error);
  }

  return (
    <>
      <div className="h-screen w-screen md:bg-secondary-2 content-center">
        <div className="flex flex-row items-center justify-center p-1 font-roboto  ">
          <div className="flex flex-col bg-white rounded-lg pt-5 px-10 md:w-[60%]">
            <div className="ml-3 flex flex-row">
              <div>
                <img src={empty_profile_photo} alt="profile photo" />
              </div>
              <div className="ml-3">
                <p className="font-bold text-xl">{business?.businessName}</p>
                <p className="text-sm">{business?.businessWebsite}</p>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-lg font-bold">Rate your recent experience</p>
              <div className="flex flex-row gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={star <= selectedRating ? rate_star : black_star}
                    alt=""
                    className="w-full max-w-[40px] cursor-pointer"
                    onClick={() => handleRatingChange(star)}
                  />
                ))}
              </div>

              {fieldErrors.rating && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.rating}
                </p>
              )}
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="mt-5">
              <div className="mt-5">
                <p className="text-lg font-bold">
                  Tell us more about your experience
                </p>
                <textarea
                  className=" border border-black rounded-md mt-2 p-2 w-full h-[200px]"
                  placeholder="What made your experience great? What is the company doing well? Remember to be honest, helpful, and constructive!"
                  name="content"
                  required
                  onChange={handleChange}
                  value={review.content}
                />
                {fieldErrors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.content}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="block text-lg font-bold">
                  Give your review a title
                </label>
                <input
                  className=" mt-2 border border-black text-gray-900 text-sm rounded-lg block w-full  p-2.5 "
                  placeholder="What’s Important for people to know ?"
                  required
                  name="title"
                  onChange={handleChange}
                  value={review.title}
                />
                {fieldErrors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.title}
                  </p>
                )}
              </div>
              <div className="mt-5">
                <p>
                  By submitting this review, you confirm it’s based on a genuine
                  experience and you haven’t received an incentive to write it
                </p>
              </div>
              <div className="mt-10 mb-15">
                <button
                  type="submit"
                  className="bg-primary-1 text-white text-lg w-full p-3 rounded-xl cursor-pointer hover:bg-primary-1-hover transition duration-300 ease-in-out"
                  onClick={handelSubmit}
                >
                  Submit your review
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default WriteReview;
