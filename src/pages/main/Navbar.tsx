import { Bars3Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string; // or 'email' or 'id' depending on your token
  role?: string;
  exp?: number;
}

function NavBar() {
  const { token } = useAuth();
  const { logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<JwtPayload | null>(null);

  const fetchUser = () => {
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
      console.log("Decoded user data:", decoded);
    }
  };
  useEffect(() => {
    fetchUser();
    // console.log("Fetching user data...");
  }, [token]);

  return (
    <div
      className="w-full font-roboto fixed top-0 left-0 z-50"
      style={{ height: "auto" }}
    >
      <div className="flex flex-row justify-between items-center bg-[#1C1C1C] p-4">
        <h1
          className="text-white text-xl font-bold cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          TrustMark Lanka
        </h1>
        <div className="relative">
          <button
            className="text-white focus:outline-none md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <nav
            className={`${
              menuOpen ? "block" : "hidden"
            } absolute top-full left-0 w-full md:static md:flex md:space-x-4 md:justify-center md:items-center`}
          >
            <a
              href="/search"
              className="block text-white hover:text-gray-400 p-2 md:inline"
            >
              Write a Review
            </a>
            {/* <a
              href="/search"
              className="block text-white hover:text-gray-400 p-2 md:inline"
            >
              Categories
            </a> */}
            {user ? (
              <div className="relative inline-block text-left">
                <button
                  className="block text-white p-2 md:inline focus:outline-none cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.sub}
                </button>
                {menuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#1C1C1C]  rounded-md shadow-lg z-10">
                    <a
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-secondary-1 hover:text-black"
                    >
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        setUser(null);
                        window.location.href = "/";
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-secondary-1 hover:text-black cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="block text-white hover:text-gray-400 p-2 md:inline"
              >
                Log in
              </a>
            )}
            <button
              className="block bg-secondary-1 font-bold p-3 px-8 rounded-3xl cursor-pointer hover:text-white hover:bg-primary-1 transition duration-300 ease-in-out md:inline"
              onClick={() => {
                window.location.href = "/addbusiness";
              }}
            >
              For business
            </button>
          </nav>
        </div>
      </div>
      <div className="bg-gray-200 h-1"></div>
    </div>
  );
}
export default NavBar;
