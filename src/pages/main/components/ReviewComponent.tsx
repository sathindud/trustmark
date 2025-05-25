import { useEffect, useState } from "react";
import emptyImg from "../../../assets/review_assets/empty_profile_photo.png";
import rate_ster from "../../../assets/review_assets/favorite.png";
import axios from "axios";
import LazyImage from "../../../components/ImageProp";

interface Review {
  id: number;
  userName: string;
  profileImage: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  businessName: string;
  businessWebsite: string;
  businessPhoto: string;
}

function ReviewComponent() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("/api/home/getreviews");
      setReviews(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchReviews();
    console.log("Fetching review data...");
  }, []);
  return (
    <div className="w-full flex flex-col">
      <p className="font-bold text-2xl">Resent Reviews</p>
      <div className="w-full flex flex-wrap gap-5 mt-5 overflow-x-auto">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col border border-gray-300 rounded-3xl p-5 w-[295px]"
          >
            <div className="flex flex-row align-items-center">
              {review.profileImage && review.profileImage !== "" ? (
                <div className="size-10">
                  <LazyImage
                    imageName={review.profileImage}
                    alt={review.userName}
                  />
                </div>
              ) : (
                <img className="size-10" src={emptyImg} alt="" />
              )}
              <div className="flex flex-col ml-3">
                <p className="font-bold">{review.userName}</p>
                <div className="flex flex-row">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <img
                      key={index}
                      src={rate_ster}
                      alt="Star"
                      className="w-full max-w-[20px]"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 font-bold">{review.title}</p>
            <p className="mt-1">{review.content}</p>
            <div className="flex flex-col flex-1 justify-end">
              <hr className="mt-3 border-gray-300" />
              <div className="flex flex-row align-items-center my-5">
                {review.businessPhoto && review.businessPhoto !== "" ? (
                  <div className="size-10">
                    <LazyImage
                      imageName={review.businessPhoto}
                      alt={review.businessName}
                    />
                  </div>
                ) : (
                  <img className="size-10" src={emptyImg} alt="" />
                )}
                <div className="flex flex-col ml-3">
                  <p className="font-bold">{review.businessName}</p>
                  <p className="">{review.businessWebsite}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ReviewComponent;
