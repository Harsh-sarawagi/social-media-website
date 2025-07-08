import { useEffect, useState } from "react";
import useAuthstore from "../store/auth-store";
import VerticalNavbar from "../components/navbar";
import EditProfile from "./editpage";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { user } = useAuthstore();
  const [activeTab, setActiveTab] = useState("edit");
  const [likedPosts, setLikedPosts] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get("/profile", {
          params: { userID: user.userID },
        });
        const data = res.data.user;
        setLikedPosts(data.likedposts || []);
        setSentRequests(data.sentRequests || []);
        setReceivedRequests(data.receivedRequests || []);
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };
    fetchUserData();
  }, [user.userID]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
  <VerticalNavbar />

  <div className="w-full lg:w-[60vw] mx-auto p-4 sm:p-6">
    <div className="flex justify-around pt-4 sm:pt-8 mb-4 sm:mb-6 border-b border-gray-700 text-sm sm:text-base">
      <button
        onClick={() => setActiveTab("edit")}
        className={activeTab === "edit" ? "text-pink-500" : "text-gray-400"}
      >
        Edit Profile
      </button>
      <button
        onClick={() => setActiveTab("liked")}
        className={activeTab === "liked" ? "text-pink-500" : "text-gray-400"}
      >
        Liked Posts
      </button>
      <button
        onClick={() => setActiveTab("sent")}
        className={activeTab === "sent" ? "text-pink-500" : "text-gray-400"}
      >
        Sent Requests
      </button>
      <button
        onClick={() => setActiveTab("received")}
        className={activeTab === "received" ? "text-pink-500" : "text-gray-400"}
      >
        Received Requests
      </button>
    </div>

    {activeTab === "edit" && <EditProfile />}

    {activeTab === "liked" && (
      <div>
        <h2 className="text-lg sm:text-xl mb-4 text-pink-400">Your Liked Posts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {likedPosts.length > 0 ? likedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-zinc-800 p-1 sm:p-2 rounded-lg hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate(`/p/${post._id}`)}
            >
              <img
                src={post.image.url}
                alt="Liked Post"
                className="w-full h-[10rem] sm:h-[12rem] object-cover rounded-md"
              />
            </div>
          )) : <p className="text-gray-400">No liked posts yet.</p>}
        </div>
      </div>
    )}

    {activeTab === "sent" && (
      <div>
        <h2 className="text-lg sm:text-xl mb-4 text-pink-400">Sent Friend Requests</h2>
        <div className="space-y-2">
          {sentRequests.length > 0 ? sentRequests.map((req) => (
            <div key={req._id} 
            className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg pointer-cursor"
            onClick={()=>navigate(`/profile/${req.userID}`)}
            >
              <img
                src={req.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
                className="w-10 h-10 rounded-full object-cover"
                alt="profile"
              />
              <div>
                <p className="font-semibold">{req.userID}</p>
                <p className="text-sm text-gray-400">{req.name}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">No sent requests.</p>}
        </div>
      </div>
    )}

    {activeTab === "received" && (
      <div>
        <h2 className="text-lg sm:text-xl mb-4 text-pink-400">Received Friend Requests</h2>
        <div className="space-y-2">
          {receivedRequests.length > 0 ? receivedRequests.map((req) => (
            <div key={req._id} className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg"
            onClick={()=>navigate(`/profile/${req.userID}`)}
            >
              <img
                src={req.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
                className="w-10 h-10 rounded-full object-cover"
                alt="profile"
              />
              <div>
                <p className="font-semibold">{req.userID}</p>
                <p className="text-sm text-gray-400">{req.name}</p>
              </div>
            </div>
          )) : <p className="text-gray-400">No received requests.</p>}
        </div>
      </div>
    )}
  </div>
</div>

  );
}
