import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function SearchComponent() {
  const handleSearch = () => {
    const keyword = (
      document.getElementById("search-input") as HTMLInputElement
    )?.value;
    if (keyword) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  return (
    <div className="w-full h-1/4 flex flex-col items-center justify-center my-10  font-roboto">
      <h1 className="text-5xl font-extrabold mb-5 text-center">
        Find a company you can trust
      </h1>
      <h2 className="text-2xl font-light  ">Real reviews by real people</h2>
      <div className="mt-10 lg:w-[50%] w-full bg-white drop-shadow-lg p-3 rounded-4xl flex items-center">
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
    </div>
  );
}
export default SearchComponent;
