import {
  Home,
  Search,
  User,
  PlusCircle,
  LogOut,
  Bell,
  MoreHorizontal
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import { useState, useEffect } from "react";
import API from "../api/api";

export default function VerticalNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasunread,sethasunread]= useState(false);

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

  const fetchNotifications = async () => {
  try {
    const res = await API.get('/notification', { withCredentials: true });
    setNotifications(res.data);
    const unreadExists = res.data.some((notif) => !notif.isRead);
    sethasunread(unreadExists);
  } catch (err) {
    console.error("Failed to fetch notifications", err);
  }
};

  useEffect(() => {
   fetchNotifications();
  },[] );

  const navItems = [
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "Search", icon: <Search size={20} />, onClick: () => setShowSearch(true) },
    { name: "Profile", icon: <User size={20} />, path: `/profile/${user.userID}` },
    { name: "Post", icon: <PlusCircle size={20} />, path: "/p/create" },
    { name: "Notifications", icon: <Bell size={20} />, onClick: () => setShowNotifications(true) },
    { name: "More", icon: <MoreHorizontal size={20} />, path: "/account" }
  ];

  return (
    <>
      {/* Large screen navbar */}
      <div className="hidden lg:flex flex-col justify-between w-[20vw] min-h-screen bg-black text-white py-[4rem] px-[2rem] border-r border-zinc-800">
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

      {/* Medium screen navbar */}
      <div className="hidden md:flex lg:hidden flex-col justify-between w-[6rem] min-h-screen bg-black text-white py-[4rem] px-3 border-r border-zinc-800">
        <div className="space-y-10">
          <h1 className="text-xl font-bold text-pink-500">M</h1>
          <nav className="flex flex-col gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
                className="flex items-center justify-center h-[2.5rem] rounded-xl hover:bg-zinc-800 transition"
              >
                {item.icon}
                {item.name=="Notifications" && hasunread && (
    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
  )}
              </button>
              
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center px-3 py-2 rounded-xl hover:bg-zinc-800 text-blue-400"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Small screen navbar */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around py-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => item.path ? navigate(item.path) : item.onClick?.()}
            className="flex flex-col items-center justify-center text-white text-sm"
          >
            {item.icon}
          </button>
        ))}
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
              ×
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
                            src={
                              profile.profilepicture ||
                              "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
                            }
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

      {/* Notifications Overlay */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex justify-center items-start pt-[10vh] px-[10vw] min-h-[10rem]">
          <div className="bg-zinc-900 w-full max-w-xl rounded-xl p-6 shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-white">Notifications</h2>
            <div className="max-h-[300px] overflow-y-auto space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n._id} className="text-sm flex gap-2 text-white border-b border-zinc-700 pb-2">
                    <img
                            src={
                              n.from?.profilepicture ||
                              "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
                            }
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                    <span className="font-medium"
                    onClick={()=>navigate(`/profile/${n.from?.userID}`)}
                    >{n.from?.name || 'Someone'}</span> {renderMessage(n)}
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-sm">No notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function renderMessage(n) {
  switch (n.type) {
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'commented on your post';
    case 'request_sent':
      return 'sent you a friend request';
    case 'request_accepted':
      return 'accepted your friend request';
    case 'request_rejected':
      return 'rejected your friend request';
    default:
      return '';
  }
}
