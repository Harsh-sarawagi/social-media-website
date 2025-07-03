import {
  Home,
  Search,
  User,
  PlusCircle,
  MoreHorizontal,
  LogOut,
  Send,
  Inbox,
  Heart,
  X,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import { useState, useEffect } from "react";
import API from "../api/api"; // Ensure this is your axios instance

export default function VerticalNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [showMore, setShowMore] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const searchProfiles = async (name) => {
    try {
      const res = await API.get(`/search?name=${encodeURIComponent(name)}`);
      return res.data;
    } catch (err) {
      console.error("Search failed", err);
      return [];
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProfiles(searchQuery).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    {
      name: "Search",
      icon: <Search size={20} />,
      onClick: () => setShowSearch(true),
    },
    { name: "Profile", icon: <User size={20} />, path: `/profile/${user.userID}` },
    { name: "Post", icon: <PlusCircle size={20} />, path: "/p/create" },
    { name: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
  ];

  const moreItems = [
    { name: "Sent Requests", icon: <Send size={18} />, path: "/sent-requests" },
    { name: "Received Requests", icon: <Inbox size={18} />, path: "/received-requests" },
    { name: "Liked Posts", icon: <Heart size={18} />, path: "/liked-posts" },
  ];

  return (
    <>
      {/* Main vertical navbar */}
      <div className="w-[20vw] min-h-screen bg-black text-white flex flex-col justify-between py-[4rem] px-[2rem] border-r border-zinc-800 relative">
        <div className="space-y-[4rem]">
          <h1 className="text-2xl font-bold text-pink-500">MyApp</h1>
          <nav className="flex flex-col gap-[1.5rem]">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
                className="flex items-center gap-[1rem] h-[2.5rem] text-left px-3 py-2 rounded-xl hover:bg-zinc-800 transition"
              >
                {item.icon}
                <span className="text-l font-medium">{item.name}</span>
              </button>
            ))}
            {/* More button with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl hover:bg-zinc-800 transition"
              >
                <div className="flex items-center gap-3">
                  <MoreHorizontal size={20} />
                  <span className="text-l font-medium">More</span>
                </div>
              </button>

              {showMore && (
                <div className="absolute left-full top-0 ml-3 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg z-50 p-2 w-52">
                  {moreItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setShowMore(false);
                      }}
                      className="flex items-center gap-2 text-left text-zinc-300 hover:text-white hover:bg-zinc-800 px-2 py-1 rounded-lg transition text-sm w-full"
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-800 text-blue-400"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex justify-center items-start pt-[10vh] px-[10vw] min-h-[10rem]">
          <div className="bg-zinc-900 w-full max-w-xl rounded-xl p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              onClick={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
            >
              <X size={20} />
            </button>
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none"
            />
            <div className="mt-4 max-h-[300px] overflow-y-auto">
              {searchQuery.trim() ? (
                searchResults.length > 0 ? (
                  <ul className="space-y-3">
                    {searchResults.map((profile) => (
                      <li
                        key={profile._id}
                        className="cursor-pointer hover:bg-zinc-800 px-3 py-2 rounded-lg transition text-white"
                        onClick={() => {
                          navigate(`/profile/${profile.userID}`);
                          setShowSearch(false);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={profile.profilePic || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="text-sm font-medium">{profile.name}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-500 text-sm">No results found.</p>
                )
              ) : (
                <div className="text-zinc-600 text-sm">Type something to search...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
