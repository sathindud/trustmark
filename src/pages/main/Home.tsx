import BusinessComponent from "./components/BusinessComponent";
import CategoryComponent from "./components/CategoryComponent";
import ReviewComponent from "./components/ReviewComponent";
import SearchComponent from "./components/SearchComponent";
import Footer from "./Footer";
import NavBar from "./Navbar";

function Home() {
  return (
    <div className=" font-roboto">
      <div className="w-full mt-20 p-10 py-20 flex flex-col items-center  bg-[#FCFBF3]">
        <SearchComponent />
      </div>
      <div className="w-full flex flex-col items-center py-5">
        <button
          className=" border-1 border-gray-300 p-3 my-3 px-5 rounded-3xl flex flex-row cursor-pointer"
          onClick={() => {
            window.location.href = "/search";
          }}
        >
          <p>Bought something recently? </p>
          <p className="text-blue-500 ml-2">Write a review</p>
        </button>
      </div>
      <div className="xl:w-[60%] w-full px-10 mx-auto">
        <CategoryComponent />
        <div className="w-full rounded-3xl flex flex-col lg:flex-row bg-red-200 my-10 px-10 py-7">
          <div className="flex-1">
            <p className="font-bold text-lg">Looking to grow your business?</p>
            <p>Strengthen your reputation with real reviews on Trustpilot.</p>
          </div>
          <div className="flex items-start">
            <button
              className=" bg-black mt-4 lg:mt-0 text-white rounded-4xl p-3 px-5 font-bold cursor-pointer hover:bg-red-500 hover:text-black transition duration-300 ease-in-out"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Get started
            </button>
          </div>
        </div>
        <BusinessComponent />
        <div className="w-full rounded-3xl flex flex-row bg-[#F0D3B6] my-10 px-10 py-7">
          <div className="flex flex-col py-10 w-full lg:w-1/2 break-words">
            <p className="font-bold text-4xl ">
              Help millions make the right choice
            </p>
            <p className="mt-4 text-lg">
              Share your experience on Trustpilot, where real reviews make a
              difference.
            </p>
            <button
              className="w-45 mt-10 bg-black text-white rounded-4xl p-3 px-5 font-bold cursor-pointer hover:bg-amber-700 hover:text-black transition duration-300 ease-in-out"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login or sign up
            </button>
          </div>
        </div>
        <ReviewComponent />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
