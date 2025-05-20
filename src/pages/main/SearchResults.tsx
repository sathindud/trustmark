import { useEffect, useState } from "react";
import emptyImg from "../../assets/review_assets/empty_profile_photo.png";
import rate_ster from "../../assets/review_assets/favorite.png";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function SearchResults() {
  interface Business {
    id: number;
    name: string;
    website: string;
    rating: number;
    total_reviews: number;
  }
  const [business, setBusiness] = useState<Business[]>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchKeyWord = searchParams.get("keyword");

  const fetchBusiness = async () => {
    if (searchKeyWord !== null) {
      try {
        const response = await axios.get("/api/home/search", {
          params: {
            keyword: searchKeyWord,
          },
        });
        setBusiness(response.data);
      } catch (error) {}
    }
  };

  const handleSearch = () => {
    const keyword = (
      document.getElementById("search-input") as HTMLInputElement
    )?.value;
    if (keyword) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  useEffect(() => {
    fetchBusiness();
    console.log("Fetching business data...");
  }, []);
  return (
    <div className="w-full h-screen flex flex-col  bg-[#FCFBF3] items-center">
      <div className="w-full flex flex-col items-center justify-center bg-white py-5 pb-10">
        <div className="mt-10 lg:w-[50%] w-full bg-white drop-shadow-lg p-3 my-10 rounded-4xl flex items-center">
          <input
            type="text"
            className="flex-grow outline-none px-4 py-2 text-lg w-full sm:w-auto"
            placeholder="Search for a company..."
            aria-label="Search for a company"
            id="search-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            className="bg-blue-700 rounded-full p-3 flex items-center justify-center cursor-pointer hover:bg-blue-400"
            aria-label="Search"
            onClick={handleSearch}
          >
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        {searchKeyWord && (
          <p className="text-4xl font-bold">Results for "{searchKeyWord}"</p>
        )}
      </div>
      <div className="w-full flex flex-col  px-10 pt-5 xl:w-[40%] md:w-[70%]">
        <p className="font-bold">
          Companies
          <span className="font-light ml-2">({business.length})</span>
        </p>

        {business.map((biz) => (
          <div
            key={biz.id}
            className="bg-white w-full my-5 p-5 flex flex-col rounded-xl drop-shadow-sm hover:drop-shadow-lg cursor-pointer"
            onClick={() => {
              window.location.href = `/read-review/${biz.id}`;
            }}
          >
            <div className="w-full flex flex-row items-center">
              <img src={emptyImg} className="size-15" alt="" />
              <div className="flex flex-col ml-3">
                <p className="font-bold text-md">{biz.name}</p>
                <p className="font-light text-sm">{biz.website}</p>
                <div className="flex flex-row mt-3">
                  {Array.from(
                    { length: Math.round(biz.rating) },
                    (_, index) => (
                      <img
                        key={index}
                        src={rate_ster}
                        alt="Star"
                        className="w-full max-w-[20px]"
                      />
                    )
                  )}
                  <p className="ml-3  text-sm">
                    Trust Score {biz.rating} | Reviews: ({biz.total_reviews})
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default SearchResults;
