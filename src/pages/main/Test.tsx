import React from "react";

const TrustpilotPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-black text-white flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <span className="text-green-400 font-bold text-xl">★ Trustpilot</span>
        </div>
        <nav className="flex items-center space-x-4">
          <button className="hover:underline">Write a review</button>
          <button className="hover:underline">Categories</button>
          <button className="hover:underline">Blog</button>
          <div className="flex items-center space-x-2">
            <div className="rounded-full w-8 h-8 bg-gray-700"></div>
            <span>Sandindi</span>
          </div>
          <button className="bg-blue-500 px-4 py-2 rounded">
            For businesses
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-yellow-50 flex flex-col items-center justify-center py-16 relative">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Find a company you can trust
        </h1>
        <p className="text-lg mb-6 text-center">Real reviews by real people.</p>
        <div className="flex">
          <input
            type="text"
            placeholder="Search company or category"
            className="px-6 py-3 rounded-l-full border border-gray-300 w-80"
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-r-full">
            🔍
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">
          What are you looking for?
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            "Bank",
            "Travel Insurance Company",
            "Car Dealer",
            "Furniture Store",
            "Jewelry Store",
            "Clothing Store",
            "Electronics & Technology",
            "Fitness and Nutrition Service",
          ].map((category) => (
            <div key={category} className="px-4 py-2 bg-gray-100 rounded-full">
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* Best Companies */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Best in Bank</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 flex flex-col items-center"
              >
                <div className="bg-gray-200 w-20 h-20 mb-4"></div>
                <h3 className="font-semibold">Company Name</h3>
                <p className="text-green-600">⭐⭐⭐⭐☆</p>
              </div>
            ))}
        </div>
      </section>

      {/* Trustpilot About Block */}
      <section className="bg-green-100 p-8 my-8 mx-4 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">We're Trustpilot</h2>
        <p className="mb-4">
          We’re a review platform that’s open to everyone. Our vision is to
          become the universal symbol of trust.
        </p>
        <button className="bg-black text-white px-6 py-2 rounded">
          What we do
        </button>
      </section>

      {/* Recent Reviews */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Recent reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Company</h3>
                <p className="text-sm mb-2">Review summary goes here...</p>
                <p className="text-green-600">⭐⭐⭐⭐⭐</p>
              </div>
            ))}
        </div>
      </section>

      {/* App Download */}
      <section className="py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Shop smarter with the Trustpilot app
        </h2>
        <button className="bg-black text-white px-6 py-2 rounded mt-4">
          Download on App Store
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white p-8">
        <div className="flex flex-wrap justify-between">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <ul className="space-y-1">
              <li>About us</li>
              <li>Jobs</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Community</h3>
            <ul className="space-y-1">
              <li>Trust in reviews</li>
              <li>Help Center</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Businesses</h3>
            <ul className="space-y-1">
              <li>Trustpilot Business</li>
              <li>Products</li>
              <li>Plans & Pricing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Follow us</h3>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrustpilotPage;
