import { useEffect, useState } from "react";
import emptyImg from "../../../assets/review_assets/empty_profile_photo.png";
import rate_ster from "../../../assets/review_assets/favorite.png";
import axios from "axios";
import { loadImage } from "../../../utils/ImageLoader";
import LazyImage from "../../../components/ImageProp";
function BusinessComponent() {
  interface Business {
    id: number;
    name: string;
    website: string;
    rating: number;
    photo: string;
    totalReviews: number;
  }
  const [business, setBusiness] = useState<Business[]>([]);

  const fetchBusiness = async () => {
    try {
      const response = await axios.get("/api/home/getbusiness");
      setBusiness(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBusiness();
    console.log("Fetching business data...");
  }, []);

  return (
    <div className="w-full flex flex-col">
      <p className="font-bold text-2xl">Resent Business</p>
      <div className="w-full flex flex-row gap-5 my-5 overflow-x-auto scrollbar-hide">
        {business.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-64 flex flex-col border-1 border-gray-300 rounded-3xl p-5 mb-5 cursor-pointer hover:drop-shadow-lg"
            onClick={() => {
              window.location.href = `/read-review/${item.id}`;
            }}
          >
            {item.photo && item.photo !== "" ? (
              <div className="size-30">
                <LazyImage imageName={item.photo} alt={item.name} />
              </div>
            ) : (
              <img className="size-20" src={emptyImg} alt="" />
            )}
            <div className="mt-3">
              <p className="font-bold text-lg">{item.name}</p>
              <p className="text-sm">{item.website}</p>
            </div>
            <div className="flex flex-row mt-2">
              <div className="flex flex-row ">
                {Array.from({ length: Math.round(item.rating) }, (_, index) => (
                  <img
                    key={index}
                    src={rate_ster}
                    alt=""
                    className="w-full max-w-[20px]"
                  />
                ))}
              </div>
              <p className="ml-3 font-light text-sm">
                {item.rating.toFixed(1)} ({item.totalReviews})
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BusinessComponent;
