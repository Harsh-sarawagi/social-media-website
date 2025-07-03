import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigation, useParams } from "react-router-dom";
import VerticalNavbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Cross, CrossIcon, X } from "lucide-react";

export default function ProfilePage() {
  const { userID } = useParams();
  const [profile, setProfile] = useState(null);
  const [relation, setRelation] = useState("stranger"); // 'self', 'friend', 'stranger', 'pending', 'requested'
  const navigate=useNavigate()
  const [showfriends,setshowfriends]= useState(false);
//   const [user, setuser]= useState();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile`, { params: { userID } });
        const data = res.data;
        const role=data.role;
        const user=data.user;
        setProfile(user);

        setRelation(role)
        console.log(relation)
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [userID,relation]);

  const handlesendrequest=async()=>{
        try{
            console.log(profile._id)
            const response= await API.post('/friend/send',{
            receiverId:profile._id
        })
        setRelation("requested")
    }catch(err){
        console.log(err)
    }
  }
  const handleacceptrequest=async()=>{
        try{
            const response= await API.post('/friend/accept',{
            senderId:profile._id
        })
        setRelation("friend")
    }catch(err){
        console.log(err)
    }
  }
  const handlerejectrequest=async()=>{
        try{
            const response= await API.post('/friend/reject',{
            senderId:profile._id
        })
        setRelation("stranger")
    }catch(err){
        console.log(err)
    }
  }
  const handledeleterequest=async()=>{
        try{
            const response= await API.post('/friend/delete',{
            receiverId:profile._id
        })
        setRelation("stranger")
    }catch(err){
        console.log(err)
    }
  }
  const handleunfriend=async()=>{
        try{
            const response= await API.post('/friend/unfriend',{
            friendId:profile._id
        })
        setRelation("stranger")
    }catch(err){
        console.log(err)
    }
  }

  if (!profile) return <div className=" bg-black w-screen h-screen text-white flex items-center justify-center text-3xl">Loading...</div>;

  if(relation=="self"){
    return (
        <div className="flex">
        <VerticalNavbar/>
        <div className="w-[80vw] bg-black flex pt-[4rem] justify-center">
    <div className="w-[60vw] bg-black rounded-2xl p-6 text-white ">
      <div className="flex pt-[2rem]  gap-[6rem] max-h-[26rem] pb-[1rem] border-b-2 border-zinc-600">
        <img
          src={profile.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
          className="w-[11rem] h-[11rem]  rounded-full  object-cover"
          alt="Profile"
        />
        <div className="flex-1">
          <div className="flex gap-[6rem] items-center">
            <h2 className="text-2xl pt-[0rem] font-bold">{profile.userID}</h2>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded-xl"
            onClick={()=>navigate("/account/?tab=edit")}
            >
              Edit Profile
            </button>
          </div>
          <div className="mt-6 flex gap-[8rem]  pt-4">
        <Stat label="Posts" value={profile.posts?.length || profile.postCount || 0} />
        <Stat 
        onClick={()=>{
          console.log("click");
          setshowfriends(!showfriends)}}
        label="Friends" value={profile.friendlist?.length || profile.friendCount || 0} />
      </div>
          <p className="text-zinc-400 mt-[2rem]">{profile.name}</p>
          <pre className="text-zinc-300 min-h-[4rem] mt-2">{profile.bio || "No bio yet"}</pre>
        </div>
        {showfriends && (
  <div className="absolute top-[12rem] right-[10rem] w-[25rem] max-h-[30rem] overflow-y-auto rounded-xl shadow-lg bg-zinc-800 text-black p-4 z-50 border-2 border-pink-600 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-200">
    <div className="flex justify-between items-center mb-4 px-1">
  <h3 className="text-xl font-bold text-white">Friends</h3>
  <button
    onClick={() => setshowfriends(false)}
    className="text-zinc-400 hover:text-pink-500 transition-colors"
  >
    <X className="w-5 h-5" />
  </button>
</div>

    {profile.friendlist && profile.friendlist.length > 0 ? (
  <div className="space-y-2 p-2">
    {profile.friendlist.map((friend) => (
      <div
        key={friend._id}
        className="flex items-center justify-between gap-3 bg-black/30 hover:bg-pink-500/20 p-3 rounded-xl cursor-pointer transition-all"
        onClick={() => {
          setshowfriends(false);
          navigate(`/profile/${friend.userID}`);
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={
              friend.profilepicture ||
              "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
            }
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
)}

      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mt-6">
      {profile.posts?.map((post, index) => (
        <div key={index} className="aspect-square overflow-hidden rounded-md bg-zinc-800">
          <img
            src={post.image.url}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onClick={()=>navigate(`/p/${post._id}`)}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
    </div>
  );
}


    if(relation=="friend"){
    return (
        <div className="flex">
        <VerticalNavbar/>
        <div className="w-[80vw] bg-black flex pt-[4rem] justify-center">
    <div className="w-[60vw] bg-black rounded-2xl p-6 text-white ">
      <div className="flex pt-[2rem] gap-[6rem] max-h-[24rem] border-b-2 border-zinc-600">
        <img
          src={profile.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
          className="w-[10rem] h-[10rem]  rounded-full border-4 border-pink-500 object-cover"
          alt="Profile"
        />
        <div className="flex-1">
          <div className="flex gap-[6rem] items-center">
            <h2 className="text-2xl pt-[0rem] font-bold">{profile.userID}</h2>
            <button className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-1 rounded-xl"
            onClick={()=>handleunfriend()}
            >
              unfriend
            </button>
          </div>
          <div className="mt-6 flex gap-[8rem]  pt-4">
        <Stat label="Posts" value={profile.posts?.length || profile.postCount || 0} />
        <Stat 
        onClick={()=>setshowfriends(!showfriends)}
        label="Friends" value={profile.friendlist?.length || profile.friendCount || 0} />
      </div>
          <p className="text-zinc-400 mt-[2rem]">{profile.name}</p>
          <pre className="text-zinc-300 min-h-[4rem] mt-2">{profile.bio || "No bio yet"}</pre>
          {showfriends && (
  <div className="absolute top-[12rem] right-[10rem] w-[25rem] max-h-[30rem] overflow-y-auto rounded-xl shadow-lg bg-zinc-800 text-black p-4 z-50 border-2 border-pink-600 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-200">
    <div className="flex justify-between items-center mb-4 px-1">
  <h3 className="text-xl font-bold text-white">Friends</h3>
  <button
    onClick={() => setshowfriends(false)}
    className="text-zinc-400 hover:text-pink-500 transition-colors"
  >
    <X className="w-5 h-5" />
  </button>
</div>

    {profile.friendlist && profile.friendlist.length > 0 ? (
  <div className="space-y-2 p-2">
    {profile.friendlist.map((friend) => (
      <div
        key={friend._id}
        className="flex items-center justify-between gap-3 bg-black/30 hover:bg-pink-500/20 p-3 rounded-xl cursor-pointer transition-all"
        onClick={() => {
          setshowfriends(false);
          navigate(`/profile/${friend.userID}`);
        }}
      >
        <div className="flex items-center gap-3">
          <img
            src={
              friend.profilepicture ||
              "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
            }
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
)}
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 mt-6">
      {profile.posts.map((post, index) => (
        <div key={index} className="aspect-square overflow-hidden rounded-md bg-zinc-800">
          <img
            src={post.image.url}
            alt={`Post ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onClick={()=>navigate(`/p/${post._id}`)}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
    </div>
  );
}


    else{
    return (
        <div className="flex">
        <VerticalNavbar/>
        <div className="w-[80vw] bg-black flex pt-[4rem] justify-center">
    <div className="w-[60vw] bg-black rounded-2xl p-6 text-white ">
      <div className="flex pt-[2rem] gap-[6rem] max-h-[24rem] ">
        <img
          src={profile.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
          className="w-[10rem] h-[10rem]  rounded-full border-4 border-pink-500 object-cover"
          alt="Profile"
        />
        <div className="flex-1">
          <div className="flex gap-[6rem] items-center">
            <h2 className="text-2xl pt-[0rem] font-bold">{profile.userID}</h2>
            
          </div>
          <div className="mt-6 flex gap-[8rem]  pt-4">
        <Stat label="Posts" value={profile.posts?.length || profile.postCount || 0} />
        <Stat label="Friends" value={profile.friendlist?.length || profile.friendCount || 0} />
      </div>
          <p className="text-zinc-400 mt-[2rem]">{profile.name}</p>
          <pre className="text-zinc-300 min-h-[4rem] mt-2">{profile.bio || "No bio yet"}</pre>
        </div>
      </div>
      {
        relation==="stranger" && (
            <button className="bg-blue-700 w-[80%] h-[2rem] mt-[1rem] rounded-xl ml-[4rem]"
            onClick={()=>handlesendrequest()}
            >send request </button>
        )
      }
      {
        relation==="requested" && (
            <button className="bg-zinc-600 w-[80%] h-[2rem] mt-[1rem] rounded-xl ml-[4rem]"
            onClick={()=>handledeleterequest()}
            >Requested </button>
        )
      }
      {
        relation==="pending" && (<>
            <button className="bg-blue-700 w-[30%] h-[2rem] mt-[1rem] rounded-xl ml-[4rem]"
                onClick={()=>handleacceptrequest()}
            >Accept </button>
            <button className="bg-zinc-700 w-[30%] h-[2rem] mt-[1rem] rounded-xl ml-[4rem]"
            onClick={()=>handlerejectrequest()}
            >Reject</button>
            </>
        )
      }
    </div>
    </div>
    </div>
  );
}
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

