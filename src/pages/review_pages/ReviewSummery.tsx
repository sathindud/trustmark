import star from "../../assets/review_assets/star.png";
import empty_profile_photo from "../../assets/review_assets/empty_profile_photo.png";
import rate_ster from "../../assets/review_assets/favorite.png";
import {
  EllipsisVerticalIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import { CheckBadgeIcon as CheckSolid } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorComponent from "./components/ErrorComponent";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";
import LazyImage from "../../components/ImageProp";

interface ReviewSummeryProps {
  id: number;
  username: string;
  userEmail: string;
  rating: number;
  review: string;
  reviewTitle: string;
  date: string;
  profileImage: string | null;
  responseContent: string[] | null;
  responseCreatedAt: string[] | null;
  status: string;
}

interface BusinessProps {
  id: number;
  userEmail: string;
  name: string;
  description: string;
  website: string;
  verificationStatus: string;
  photo: string;
  phone: string;
  addressL1?: string;
  addressL2?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

interface JwtPayload {
  sub: string; // or 'email' or 'id' depending on your token
  role?: string;
  exp?: number;
}

function ReviewSummery({ bId = -1 }: { bId?: number }) {
  const { token } = useAuth();
  const [user, setUser] = useState<JwtPayload | null>(null);

  const { businessId: paramBusinessId } = useParams<{ businessId: string }>();
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [businessData, setBusinessData] = useState<BusinessProps | null>(null);
  const [reviews, setReviews] = useState<ReviewSummeryProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedReview, setEditedReview] = useState<ReviewSummeryProps | null>(
    null
  );
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showReply, setShowReply] = useState<number | null>(null);

  /**
   * Handling the floating menue toggle delete, edit and flag
   */
  const toggleMenu = (id: number) => {
    if (showMenu === id) {
      setShowMenu(null);
    } else {
      setShowMenu(id);
    }
  };

  useEffect(() => {
    if (paramBusinessId) {
      const parseBusinessId = parseInt(paramBusinessId);
      console.log("Received businessId from params:", parseBusinessId);
      if (parseBusinessId > 0) {
        setBusinessId(parseBusinessId);
      } else if (bId != -1) {
        setBusinessId(bId);
      } else {
        console.error("Invalid business ID:", paramBusinessId);
        setError("Invalid business ID");
      }
    } else {
      console.error("No business ID provided in params");
      setError("No business ID provided");
    }
  }, [paramBusinessId]);

  useEffect(() => {
    if (businessId !== null && businessData === null) {
      console.log("Fetching business data for ID:", businessId);
      fetchBusinessData(businessId);
    }
    console.log(businessData);
  }, [businessId]);

  useEffect(() => {
    fetchUser();
  }, [token]);

  const fetchBusinessData = async (buisnessId: number) => {
    setError(null);
    try {
      const response = await axios.get("/api/getbusinessreviews", {
        params: {
          business_id: buisnessId,
        },
      });
      setBusinessData(response.data);
      console.log("Business data:", businessData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("API Gateway error");
    }
  };

  const fetchUser = () => {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
      console.log("Decoded user data:", decoded);
    }
  };

  /**
   * Getting the Reviews
   */
  useEffect(() => {
    if (reviews === null && businessId !== null) {
      fetchReviews(businessId);
    }
  }, [businessId]);

  const fetchReviews = async (buisnessId: number) => {
    setError(null);
    try {
      const response = await axios.get("/api/getreviews", {
        params: {
          business_id: buisnessId,
        },
      });
      const data = response.data;

      const reviewSummery: ReviewSummeryProps[] = data.map((review: any) => ({
        id: review.id,
        username: review.userName,
        userEmail: review.userEmail,
        profileImage: review.profileImage,
        rating: review.rating,
        review: review.content,
        reviewTitle: review.title,
        date: review.createdAt.endsWith("Z")
          ? review.createdAt
          : review.createdAt + "Z",
        status: review.status,
        responseContent:
          review.response?.map((res: any) => res.content) || null,
        responseCreatedAt:
          review.response?.map((res: any) =>
            res.createdAt.endsWith("Z") ? res.createdAt : res.createdAt + "Z"
          ) || null,
      }));
      setReviews(reviewSummery);
      console.log("Review data:", reviewSummery);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("API Gateway error");
    }
  };

  const updateLocalReviewState = (updatedReview: ReviewSummeryProps) => {
    setReviews((prevReviews) =>
      prevReviews
        ? prevReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        : null
    );
  };

  const removeReviewFromState = (reviewId: number) => {
    setReviews((prevReviews) =>
      prevReviews
        ? prevReviews.filter((review) => review.id !== reviewId)
        : null
    );
  };

  /**
   * Handle the date accoring to the current date
   * @param date
   * @returns
   */
  const handlePostedTime = (date: string) => {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
  };

  /**
   * Calculating the rating precentage
   * @param rating
   * @returns
   */
  const calculateRatingPrecentage = (rating: number) => {
    return reviews && reviews.length > 0
      ? (reviews.filter((review) => review.rating === rating).length /
          reviews.length) *
          100
      : 0;
  };

  /**
   * Handle Edit
   */
  const handleEdit = (reviewId: number, currentReview: ReviewSummeryProps) => {
    setShowMenu(null);
    setEditingReviewId(reviewId);
    setEditedReview(currentReview);
  };

  const handleSaveEdit = async (reviewId: number) => {
    setEditingReviewId(null);

    try {
      await axios.post(
        "/api/updatereview",
        JSON.stringify({
          title: editedReview?.reviewTitle,
          content: editedReview?.review,
        }),
        {
          params: {
            review_id: reviewId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateLocalReviewState(editedReview!);
      setEditedReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      setError("API Gateway error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedReview({ ...editedReview!, [e.target.name]: e.target.value });
  };

  /**
   * Handle Delete
   */
  const handleDelete = async (reviewId: number) => {
    setShowMenu(null);
    try {
      await axios.delete("/api/deletereview", {
        params: {
          review_id: reviewId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      removeReviewFromState(reviewId);
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("API Gateway error");
    }
  };

  /**
   * Handle the Report
   */
  const handleReport = async (reviewId: number) => {
    setShowMenu(null);
    try {
      await axios.post(
        "/api/reportreview",
        {},
        {
          params: {
            review_id: reviewId,
          },
        }
      );
      alert("Review reported successfully");
    } catch (error) {
      console.error("Error reporting review:", error);
      setError("API Gateway error");
    }
  };

  /**
   * Handle Business Response
   */

  const handleResponse = (
    reviewId: number,
    currentReview: ReviewSummeryProps
  ) => {
    setShowReply(reviewId);
    setEditingReviewId(reviewId);
    setEditedReview(currentReview);
  };

  const handleSaveResponse = async (reviewId: number, content: string) => {
    setShowReply(null);
    try {
      await axios.post(
        "/api/businessresponse",
        JSON.stringify({
          reviewId: reviewId,
          businessId: businessId,
          content: content,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Edited review:", editedReview);
      let date = new Date();
      if (editedReview) {
        if (editedReview.responseContent && editedReview.responseCreatedAt) {
          editedReview.responseContent.push(content);
          editedReview.responseCreatedAt.push(date.toString());
        } else {
          editedReview.responseContent = [content];
          editedReview.responseCreatedAt = [date.toString()];
        }
      }

      // console.log("")
      updateLocalReviewState(editedReview!);
      setEditedReview(null);
      setEditingReviewId(null);
      console.log(reviews);
    } catch (error) {
      console.error("Error responding to review:", error);
      setError("API Gateway error");
    }
  };

  const calculateRating = () => {
    if (reviews && reviews.length > 0) {
      let avg =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;
      return avg.toFixed(1);
    } else {
      return "0.0";
    }
  };

  if (error) {
    return ErrorComponent();
  }

  return (
    <>
      <div className="w-full p-10 flex flex-col bg-white drop-shadow-lg rounded-3xl">
        <div className="flex lg:flex-row flex-col justify-between">
          <div className="flex flex-row">
            {businessData?.photo && businessData.photo !== "" ? (
              <div className="size-30">
                <LazyImage
                  imageName={businessData.photo}
                  alt={businessData.name}
                />
              </div>
            ) : (
              <img className="size-20" src={empty_profile_photo} alt="" />
            )}
            <div className="flex flex-col ml-5">
              <div className="flex flex-row items-center">
                <p className="text-3xl font-bold">{businessData?.name}</p>
                {businessData?.verificationStatus === "APPROVED" ? (
                  <CheckSolid className="size-6 ml-2 text-blue-600" />
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-row mt-2 items-center">
                <p className="text-md">Reviews {reviews?.length} |</p>
                <div className="flex flex-row ml-5">
                  {Array.from(
                    { length: parseInt(calculateRating()) },
                    (_, index) => (
                      <img
                        key={index}
                        src={rate_ster}
                        alt=""
                        className="w-full max-w-[30px]"
                      />
                    )
                  )}
                  <p className="text-md font-bold ml-2">{calculateRating()}</p>
                </div>
              </div>
              <div className="mt-10">
                <p className="font-bold text-lg">Company details:</p>
                {businessData?.description && (
                  <p className="mt-2 text-md">{businessData.description}</p>
                )}
                <div className="mt-3">
                  {businessData?.addressL1 && (
                    <p className="text-md">
                      <span className="font-semibold">Address: </span>
                      {businessData.addressL1}
                      {businessData.addressL2 && `, ${businessData.addressL2}`}
                      {businessData.city && `, ${businessData.city}`}
                      {businessData.district && `, ${businessData.district}`}
                      {businessData.postalCode &&
                        `, ${businessData.postalCode}`}
                    </p>
                  )}
                  {businessData?.phone && (
                    <p className="text-md mt-1">
                      <span className="font-semibold">Phone: </span>
                      {businessData.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10 lg:pt-5">
            <button
              className="bg-blue-700 p-3 px-5 rounded-4xl text-white cursor-pointer"
              onClick={() => {
                if (businessId) {
                  window.location.href = `/evaluate?business_id=${encodeURIComponent(
                    businessId
                  )}`;
                }
              }}
            >
              Write a reviews
            </button>
            <button
              className="border border-blue-700 text-blue-700 p-3 px-5 rounded-4xl ml-3 cursor-pointer"
              onClick={() => {
                if (businessData?.website) {
                  const url = businessData.website.startsWith("http")
                    ? businessData.website
                    : `https://${businessData.website}`;
                  window.location.replace(url);
                }
              }}
            >
              Visit website
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-screen font-roboto">
        <div className="w-full md:w-1/3 ">
          <div className="w-full flex flex-col pt-10 px-5">
            <div className="flex flex-row items-center">
              <img src={star} className="w-[50px]" alt="" />
              <div className="ml-3">
                <p className="font-bold text-3xl ">{calculateRating()}</p>
              </div>
            </div>
            <div className=" mt-5">
              <p className="text-2xl font-bold">All Reviews</p>
              <p className="text-md text-gray-400">{reviews?.length} total</p>
            </div>
            <div className="mt-5 p-3 px-10 flex gap-2 flex-col rounded-xl drop-shadow-lg bg-white">
              <div className="flex flex-row items-center">
                <p className="min-w-fit text-md ">5-star</p>
                <div className="ml-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{
                      width: `${calculateRatingPrecentage(5)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row items-center">
                <p className="min-w-fit text-md ">4-star</p>
                <div className="ml-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{
                      width: `${calculateRatingPrecentage(4)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row items-center">
                <p className="min-w-fit text-md ">3-star</p>
                <div className="ml-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{
                      width: `${calculateRatingPrecentage(3)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row items-center">
                <p className="min-w-fit text-md ">2-star</p>
                <div className="ml-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{
                      width: `${calculateRatingPrecentage(2)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row items-center">
                <p className="min-w-fit text-md ">1-star</p>
                <div className="ml-3 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full"
                    style={{
                      width: `${calculateRatingPrecentage(1)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:flex-1">
          <div className="w-full flex flex-col pt-10 px-5">
            <div className="mt-5 mr-5 flex flex-wrap gap-4 self-end">
              <div className="px-4  border-1 border-gray-400 rounded-3xl">
                <select
                  className="min-w-fit py-3 px-3 outline-none"
                  defaultValue=""
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                      setReviews((prevReviews) =>
                        prevReviews
                          ? [...prevReviews].sort((a, b) =>
                              value === "5"
                                ? b.rating - a.rating
                                : a.rating - b.rating
                            )
                          : null
                      );
                    }
                  }}
                >
                  <option value="" disabled>
                    Filter by Rating
                  </option>
                  <option value="5">5 Star</option>
                  <option value="4">4 Star</option>
                  <option value="3">3 Star</option>
                  <option value="2">2 Star</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="px-4  border-1 border-gray-400 rounded-3xl">
                <select
                  className="min-w-fit py-3 px-3 outline-none"
                  defaultValue=""
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviews((prevReviews) =>
                      prevReviews
                        ? [...prevReviews].sort((a, b) =>
                            value === "latest"
                              ? new Date(b.date).getTime() -
                                new Date(a.date).getTime()
                              : new Date(a.date).getTime() -
                                new Date(b.date).getTime()
                          )
                        : null
                    );
                  }}
                >
                  <option value="" disabled>
                    Filter by Time
                  </option>
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {reviews &&
              reviews.map((review) => (
                <div className="w-full mt-10" key={review.id}>
                  <div className="flex flex-row items-center w-full relative">
                    {review.profileImage && review.profileImage !== "" ? (
                      <div className="size-10 rounded-3xl">
                        <LazyImage
                          imageName={review.profileImage}
                          alt={review.username}
                        />
                      </div>
                    ) : (
                      <img
                        className="size-20"
                        src={empty_profile_photo}
                        alt=""
                      />
                    )}
                    <div className="ml-3 ">
                      <p className="font-bold text-lg">{review.username}</p>
                      <p className="text-sm text-gray-500">
                        {handlePostedTime(review.date)}
                      </p>
                    </div>
                    <div
                      className="jusify-end ml-auto cursor-pointer"
                      onClick={() => toggleMenu(review.id)}
                    >
                      <EllipsisVerticalIcon className="size-6" />
                    </div>

                    {showMenu == review.id ? (
                      <div className="absolute top-10 right-0 flex flex-col z-10 p-2 px-5 bg-gray-100 rounded-xl">
                        {user !== null && user.sub === review.userEmail ? (
                          <div className="flex flex-col gap-2">
                            <button
                              className="p-2 px-5 rounded-xl bg-gray-300 hover:bg-gray-400"
                              onClick={() => handleEdit(review.id, review)}
                            >
                              Edit
                            </button>
                            <button
                              className="p-2 px-5 rounded-xl bg-red-700 text-white hover:bg-red-800"
                              onClick={() => handleDelete(review.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <button
                            className="p-2 px-5 rounded-xl bg-gray-300 hover:bg-gray-400"
                            onClick={() => handleReport(review.id)}
                          >
                            Report
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-row gap-1 mt-5">
                    {Array.from({ length: review.rating }, (_, index) => (
                      <img
                        key={index}
                        src={rate_ster}
                        alt=""
                        className="w-full max-w-[25px]"
                      />
                    ))}
                  </div>
                  <div className="w-full mt-3 text-md">
                    {editingReviewId === review.id && !showReply ? (
                      <div className="w-full">
                        <input
                          type="text"
                          className="w-full font-bold border border-gray-300 rounded-md p-2 mb-2"
                          value={editedReview?.reviewTitle}
                          onChange={(e) => handleChange(e)}
                          name="reviewTitle"
                        ></input>

                        <textarea
                          className="border border-gray-300 rounded-md w-full p-2"
                          value={editedReview?.review}
                          onChange={(e) => handleChange(e)}
                          name="review"
                        />
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex flex-row">
                          <p className="text-lg font-bold mb-1">
                            {review.reviewTitle}
                          </p>
                          {review.status === "APPROVED" ? (
                            <CheckBadgeIcon className="size-6 ml-2" />
                          ) : (
                            ""
                          )}
                        </div>
                        <p>{review.review}</p>
                      </div>
                    )}
                  </div>

                  {editingReviewId === review.id && !showReply ? (
                    <div className="flex flex-row items-center justify-end gap-4 mt-3">
                      <button
                        className=" bg-primary-1 p-2 px-3 rounded-xl text-white cursor-pointer hover:bg-primary-1-hover"
                        onClick={() => handleSaveEdit(review.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 p-2 px-3 rounded-xl text-white cursor-pointer hover:bg-gray-700"
                        onClick={() => {
                          setEditingReviewId(null);
                          setEditedReview(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-4 mt-3">
                      {/* <button className="flex items-center gap-1" onClick={() => {handleLike(review.id, "like")}}>
                        {helpful?.staus === "Like" ? (
                          <HandThumbUpIcon className="w-6 h-6 text-blue-500" />
                        ) : (
                          <HandThumbUpIcon className="w-6 h-6" />
                        )}
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-1">
                        {helpful?.staus === "Like" ? (
                          <HandThumbDownIcon className="w-6 h-6 text-blue-500" />
                        ) : (
                          <HandThumbDownIcon className="w-6 h-6" />
                        )}
                        <span>Dislike</span>
                      </button> */}

                      {businessData?.userEmail === user?.sub && !showReply && (
                        <button
                          className="flex items-center gap-1 bg-gray-100 p-2 px-5 rounded-3xl hover:bg-gray-200 cursor-pointer"
                          onClick={() => handleResponse(review.id, review)}
                        >
                          Reply
                        </button>
                      )}
                    </div>
                  )}
                  {showReply === review.id && (
                    <div className="mt-5">
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Write your reply here..."
                        name="responseContent"
                      ></textarea>
                      <div className="flex justify-end gap-3 mt-2">
                        <button
                          className="bg-gray-500 p-2 px-3 rounded-xl text-white cursor-pointer hover:bg-gray-700"
                          onClick={() => {
                            setEditedReview(null);
                            setEditingReviewId(null);
                            setShowReply(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-primary-1 p-2 px-3 rounded-xl text-white cursor-pointer hover:bg-primary-1-hover"
                          onClick={() =>
                            handleSaveResponse(
                              review.id,
                              (
                                document.querySelector(
                                  `textarea[name="responseContent"]`
                                ) as HTMLTextAreaElement
                              )?.value || ""
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                  {review.responseContent &&
                    review.responseContent.length > 0 &&
                    review.responseCreatedAt &&
                    review.responseCreatedAt.length > 0 && (
                      <div className="mt-5 p-4 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-500">
                          Business Responses:
                        </p>
                        {review.responseContent.map((content, index) => (
                          <div key={index} className="mt-3">
                            <p className="text-md">{content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {review.responseCreatedAt &&
                                handlePostedTime(
                                  review.responseCreatedAt[index]
                                )}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ReviewSummery;
