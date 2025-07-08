import { useEffect, useState } from "react";
import API from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import VerticalNavbar from "../components/navbar";
import { ArrowRight, X, LogOut } from "lucide-react";
import useAuthStore from "../store/auth-store";

export default function ProfilePage() {
  const { userID } = useParams();
  const [profile, setProfile] = useState(null);
  const [relation, setRelation] = useState();
  const [showfriends, setshowfriends] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/profile`, { params: { userID } });
      const { user, role } = res.data;
      setProfile(user);
      setRelation(role);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userID]);

  const handlesendrequest = async () => {
    try {
      await API.post("/friend/send", { receiverId: profile._id });
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const handleacceptrequest = async () => {
    try {
      await API.post("/friend/accept", { senderId: profile._id });
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const handlerejectrequest = async () => {
    try {
      await API.post("/friend/reject", { senderId: profile._id });
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const handledeleterequest = async () => {
    try {
      await API.post("/friend/delete", { receiverId: profile._id });
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const handleunfriend = async () => {
    try {
      await API.post("/friend/unfriend", { friendId: profile._id });
      fetchProfile();
    } catch (err) {
      console.log(err);
    }
  };

  if (!profile) return <div className="bg-black w-screen h-screen text-white flex items-center justify-center text-3xl">Loading...</div>;

  const FriendListModal = () => (
    <div className="absolute top-[12rem] right-4 md:right-[10rem] w-[90vw] md:w-[25rem] max-h-[30rem] overflow-y-auto rounded-xl shadow-lg bg-zinc-800 text-black p-4 z-50 border-2 border-pink-600 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-200">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-xl font-bold text-white">Friends</h3>
        <button onClick={() => setshowfriends(false)} className="text-zinc-400 hover:text-pink-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      {profile.friendlist && profile.friendlist.length > 0 ? (
        <div className="space-y-2 p-2">
          {profile.friendlist.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between gap-3 bg-black/30 hover:bg-pink-500/20 p-3 rounded-xl cursor-pointer transition-all" onClick={() => {
              setshowfriends(false);
              navigate(`/profile/${friend.userID}`);
            }}>
              <div className="flex items-center gap-3">
                <img
                  src={friend.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
                  alt={friend.userID}
                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
                />
                <div>
                  <p className="text-white font-semibold">{friend.userID}</p>
                  <p className="text-sm text-blue-300">{friend.name || "No name"}</p>
                </div>
              </div>
              <ArrowRight className="text-pink-400" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">No friends yet.</p>
      )}
    </div>
  );

  const renderButtons = () => {
    if (relation === "stranger") return <button className="bg-blue-700 w-full h-[2rem] mt-4 rounded-xl" onClick={handlesendrequest}>Send Request</button>;
    if (relation === "requested") return <button className="bg-zinc-600 w-full h-[2rem] mt-4 rounded-xl" onClick={handledeleterequest}>Requested</button>;
    if (relation === "pending") return (
      <div className="flex gap-4 mt-4">
        <button className="bg-blue-700 flex-1 h-[2rem] rounded-xl" onClick={handleacceptrequest}>Accept</button>
        <button className="bg-zinc-700 flex-1 h-[2rem] rounded-xl" onClick={handlerejectrequest}>Reject</button>
      </div>
    );
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-black overflow-x-hidden overflow-y-auto">
      <VerticalNavbar />

      <div className="flex-1 flex flex-col items-center pt-10 md:pt-15 px-4 text-white">
        <div className="w-full md:w-[60vw] bg-black rounded-2xl md:p-6">
  <div className="flex flex-row sm:flex-row sm:gap-6 items-center sm:items-start border-b-2 border-zinc-600 pb-6">
  <img
    src={profile.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
    className="w-32 h-32 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full object-cover"
    alt="Profile"
  />

  <div className="flex-1 mt-4 sm:mt-0 w-full text-center sm:text-left">
    <div className="flex flex-row sm:items-center gap-10">
      <h2 className="text-2xl font-bold">{profile.userID}</h2>

      {relation === "self" && (
        <div className="flex gap-2 justify-center sm:justify-end flex-wrap text-sm">
          <button
            className="bg-pink-600 w-[5rem] hover:bg-pink-700 px-3 py-1 rounded-xl"
            onClick={() => navigate("/account/?tab=edit")}
          >
            Edit
          </button>
          
        </div>
      )}
    </div>
      <div className="mt-4 flex justify-center sm:justify-start gap-10 pt-4">
      <Stat
        label="Posts"
        value={profile.posts?.length || profile.postCount || 0}
      />
      <Stat
        label="Friends"
        value={profile.friendlist?.length || profile.friendCount || 0}
        onClick={() => setshowfriends(!showfriends)}
      />
    </div>
    <p className="text-zinc-400 mt-2">{profile.name}</p>
    <pre className="text-zinc-300 min-h-[4rem] mt-1">
      {profile.bio || "No bio yet"}
    </pre>

    

    {relation !== "self" && renderButtons()}
  </div>
</div>



          {showfriends && <FriendListModal />}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            {profile.posts?.map((post, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-md bg-zinc-800">
                <img
                  src={post.image.url}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/p/${post._id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none text-center hover:text-pink-500 transition"
    >
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}
