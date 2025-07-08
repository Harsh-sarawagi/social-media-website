import { useState , useEffect} from "react";
import VerticalNavbar from "../components/navbar";
import API from "../api/api"
import { useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, MoreVertical, MoreVerticalIcon, Trash2 } from "lucide-react";
import useAuthstore from "../store/auth-store";

export default function PostCard() {
  const {user}= useAuthstore();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const [post,setpost]= useState();
  const {postid}=useParams();
  const [hasliked,sethasliked]= useState();
  const [showMenu,setShowMenu]= useState(false);
  const navigate= useNavigate();
  
  const getpost= async(postid)=>{
    const res= await API.get(`/post/${postid}`);
    // console.log(res)
    console.log(res.data.hasliked)
    setpost(res.data.post)
    sethasliked(res.data.hasliked)
  }

  useEffect(()=>{
    getpost(postid);
  },[postid])
  const handlePostComment = async () => {
  if (!comment.trim()) return;

  try {
    const res = await API.post(`/post/${postid}/comment`, { text: comment });
    if (res.status === 201) {
      // Option 1: Refresh post to get updated comments
      getpost(postid);
      setComment(""); // Clear input
    }
  } catch (err) {
    console.error("Error posting comment:", err);
  }
};

const deleteimage = async (public_id) => {
  try {
    await API.delete("/upload/delete", {
      data: { public_id }, // ✅ Match your backend
      withCredentials: true // ✅ If you're using cookies
    });
  } catch (err) {
    console.error("Error deleting image:", err);
  }
};

const handleremovecomment = async(commentId)=>{
  const res= await API.delete(`/post/${postid}/comment/${commentId}`);
  if(res.status==200){
    getpost(postid);
  }
}

const handledeletepost = async(public_id)=>{
  const res = await API.delete(`/post/${postid}`)
  if(res.status==200){ 
    deleteimage(public_id)
    navigate(-1);
  }
}

  const handlelike= () =>{
    const setlike= async ()=>{
      const res= await API.post(`/post/${postid}/like`);
      if(res.status==200) getpost(postid);
    };
    setlike();
  };

  if(!post) return (
    <div className="flex bg-black w-screen h-screen items-center justify-center text-white text-3xl">
      Loading...
    </div>

  )
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
  <VerticalNavbar />

  {/* Large screen layout */}
  <div className="hidden lg:flex w-full justify-center mt-[4rem] pl-4">
  <div className="flex w-full max-w-[90vw] max-h-[75vh] bg-black rounded-xl shadow-lg overflow-hidden">

    {/* Image Section - Square Always */}
    <div className="aspect-square flex-1 max-w-[55%] bg-black flex items-center justify-center border-r-2 border-zinc-500">
      <img
        src={post?.image.url}
        alt="Post"
        className="h-full w-full object-cover"
      />
    </div>

    {/* Caption + Comments Section */}
    <div className="w-full max-w-[35%] flex flex-col px-[0.5rem] py-[0.8rem] justify-between bg-gradient-to-b from-pink-900 to-blue-800 text-white">
      {/* Caption Header */}
      <div className="relative flex h-[3.5rem] gap-[1rem] items-center border-b p-[0.4rem] rounded-t-xl w-full bg-black/60 border-white">
        <img
          src={post?.author.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
          alt=""
          className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"
        />
        <div className="text-l">{post.author.userID}</div>
        {user?._id === post.author._id && (
          <button
            className="absolute right-0 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVerticalIcon className="h-[1rem] stroke-red-600" />
          </button>
        )}
        {showMenu && (
          <div className="absolute right-6 flex item-center rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setShowMenu(false);
                handledeletepost(post._id);
              }}
              className="px-4 py-2 bg-transparent w-full text-red-600 text-left"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 text-sm bg-black/40 scrollbar-thin scrollbar-thumb-black/40 scrollbar-track-transparent">
        <div className="bg-black/40 pt-[1rem] items-center gap-[1rem] p-2 rounded-xl">
          <div className="flex items-center gap-[1rem]">
            <img
              src={post.author.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
              alt=""
              className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"
            />
            <strong>{post.author.userID}</strong>
          </div>
          <p className="ml-[3rem] break-all">{post.caption}</p>
        </div>

        {post.comments.length ? (
          post.comments.slice().reverse().map((c, i) => (
            <div key={i} className="bg-black/40 items-center gap-[1rem] p-2 rounded-xl relative">
              <div className="flex items-center gap-[1rem]">
                <img
                  src={c.user.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}
                  alt=""
                  className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"
                />
                <strong>{c.user.userID}</strong>
                {user?._id === c.user._id && (
                  <button
                    className="absolute right-0 cursor-pointer"
                    onClick={() => handleremovecomment(c._id)}
                  >
                    <Trash2 className="h-[1rem] stroke-red-600" />
                  </button>
                )}
              </div>
              <p className="ml-[3rem] break-all">{c.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-300">No comments yet.</p>
        )}
      </div>

      {/* Like + Comment Buttons */}
      <div className="flex gap-[0.5rem]">
        <Heart
          className={hasliked ? "fill-red-600 border-red-600 stroke-none" : "stroke-white"}
          onClick={() => handlelike()}
        />
        <span>liked by {post.likes.length}</span>
        <MessageCircle onClick={() => handlePostComment()} />
        <span>{post.comments.length} Comments</span>
      </div>

      {/* Add Comment Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 rounded-lg bg-black/50 text-white placeholder-gray-300 focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-lg"
          onClick={handlePostComment}
        >
          Post
        </button>
      </div>
    </div>
  </div>
</div>


  {/* Medium and small screen layout */}
  
  <div className="lg:hidden flex flex-col items-center justify-center w-full">
    <div className="relative flex max-w-md mt-10 justify-start gap-0 items-center w-full text-white bg-black border-t border-zinc-700 px-4 py-3">
          <div className="flex items-center gap-4">
            <img
              src={
                post.author.profilepicture ||
                "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
              }
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <strong>{post.author.userID}</strong>
            {user?._id === post.author._id && (
          <button
            className="absolute right-0 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVerticalIcon className="h-[1rem] stroke-red-600" />
          </button>
        )}
        {showMenu && (
          <div className="absolute right-6 flex item-center rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setShowMenu(false);
                handledeletepost(post._id);
              }}
              className="px-4 py-2 bg-transparent w-full text-red-600 text-left"
            >
              Delete
            </button>
          </div>
        )}
          </div>
          {/* <p className="ml-5 break-all text-white">{post.caption}</p> */}
        </div>
    {/* Image */}
    <div className="w-full px-2 max-w-md aspect-square relative">
      <img
        src={post?.image.url}
        alt="Post"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Horizontal Action Bar */}
    <div className="flex max-w-md gap-6 items-center w-full bg-black border-t border-zinc-700 px-4 py-3">
      <div className="flex items-center gap-2">
        <Heart
          className={`cursor-pointer ${
            hasliked ? "fill-red-600 stroke-none" : "stroke-white"
          }`}
          onClick={handlelike}
        />
        <span className="text-white text-sm">{post.likes.length}</span>
      </div>
      <button
        className="text-white flex items-center gap-2"
        onClick={() => setShowComments(true)}
      >
        <MessageCircle />
        <span className="text-sm">{post.comments.length}</span>
      </button>
      
    </div>
    <div className="flex max-w-md justify-start gap-0 items-center w-full text-white bg-black border-t border-zinc-700 px-4 py-3">
          <div className="flex items-center gap-4">
            {/* <img
              src={
                post.author.profilepicture ||
                "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
              }
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
            <strong>{post.author.userID}</strong> */}
          </div>
          <p className=" break-all text-white">{post.caption}</p>
        </div>
    {/* Slide-up Comment Box */}
    {showComments && (
  <div
    className="fixed right-0 bottom-0 top-0 w-full max-w-md z-50 text-white bg-black/90 backdrop-blur-sm 
               transition-transform duration-500 ease-in-out animate-fade-slide flex flex-col p-4"
    style={{ height: '100vh' }} // ensures full screen height on all devices
  >
    {/* Header */}
    <div className="flex justify-between items-center border-b border-white pb-2">
      <span className="text-white font-semibold text-lg">Comments</span>
      <button
        onClick={() => setShowComments(false)}
        className="text-white text-2xl"
      >
        ✕
      </button>
    </div>

    {/* Comments */}
    <div className="flex-1 overflow-y-auto my-2 space-y-2 bg-black/40 rounded-xl p-2 mt-2">
      {post.comments.length ? (
        post.comments
          .slice()
          .reverse()
          .map((c, i) => (
            <div
              key={i}
              className="bg-black/80 items-center gap-4 p-2 rounded-xl relative"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    c.user.profilepicture ||
                    "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <strong>{c.user.userID}</strong>
                {user?._id === c.user._id && (
                  <button
                    className="absolute right-2"
                    onClick={() => handleremovecomment(c._id)}
                  >
                    <Trash2 className="h-4 stroke-red-600" />
                  </button>
                )}
              </div>
              <p className="ml-12 break-all">{c.text}</p>
            </div>
          ))
      ) : (
        <p className="text-gray-300">No comments yet.</p>
      )}
    </div>

    {/* Input */}
    <div className="flex items-center gap-2 pt-2">
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 px-3 py-2 rounded-lg bg-black/50 text-white placeholder-gray-300 focus:outline-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 rounded-lg"
        onClick={handlePostComment}
      >
        Post
      </button>
    </div>
  </div>
)}


  </div>
</div>


  );
}
