import { useState , useEffect} from "react";
import VerticalNavbar from "../components/navbar";
import API from "../api/api"
import { useNavigate, useParams } from "react-router-dom";
import { Heart, MessageCircle, MoreVertical, MoreVerticalIcon, Trash2 } from "lucide-react";
import useAuthstore from "../store/auth-store";

export default function PostCard() {
  const {user}= useAuthstore();
  const [comment, setComment] = useState("");
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
    <div className="flex bg-black">
      <VerticalNavbar/>
      <div className="w-[65vw] h-[80vh] mt-[4rem] mx-[5rem] flex bg-black rounded-xl shadow-lg overflow-hidden">
      {/* Image section */}
      <div className="w-[65%] bg-black flex items-center justify-center border-r-2  border-zinc-500">
        <img
          src={post?.image.url}
          alt="Post"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Caption + Comments */}
      <div className="w-[35%] flex flex-col px-[0.5rem] py-[0.8rem] justify-between bg-gradient-to-b from-pink-900 to-blue-800 p-4 text-white">
        {/* Caption */}
        <div className="relative flex h-[3.5rem] gap-[1rem] items-center border-b p-[0.4rem] rounded-t-xl w-full bg-black/60 border-white">
          <img src={post?.author.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"} alt="" 
          className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"/>
          <div className="text-l ">
            {post.author.userID}
          </div>
          {user?._id===post.author._id && (
                  <button
                  className=" absolute right-0 cursor-pointer"
                  onClick={()=>setShowMenu(!showMenu)}
                  ><MoreVerticalIcon className="h-[1rem] stroke-red-600"/></button>
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
        

        {/* Comments */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2 text-sm bg-black/40 scrollbar-thin scrollbar-thumb-black/40 scrollbar-track-transparent">
        <div className="bg-black/40 pt-[1rem] items-center gap-[1rem] p-2 rounded-xl">
                <div className="flex items-center gap-[1rem]"><img src={post.author.profilepicture || "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"} alt="" 
          className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"/><strong>{post.author.userID}</strong></div> 
          <p className="ml-[3rem] break-all ">{post.caption}</p>
              </div>
          {post.comments.length ? (
            post.comments.slice().reverse().map((c, i) => (
              <div key={i} className="bg-black/40 items-center gap-[1rem] p-2 rounded-xl relative">
                <div className="flex items-center gap-[1rem] "><img src={c.user.profilepicture|| "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png"}  alt="" 
                className="w-[2.5rem] h-[2.5rem] rounded-full object-cover"/><strong>{c.user.userID}</strong>
                {user?._id===c.user._id && (
                  <button
                  className=" absolute right-0 cursor-pointer"
                  onClick={()=>handleremovecomment(c._id)}
                  ><Trash2 className="h-[1rem] stroke-red-600"/></button>
                )}
                </div> 
          <p className="ml-[3rem] break-all ">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No comments yet.</p>
          )}
        </div>
          <div className="flex gap-[0.5rem]">
            <Heart 
            className={hasliked? "fill-red-600 border-red-600 stroke-none":""}
            onClick={()=>handlelike()}
            /> 
            <span>liked by {post.likes.length}</span>
            <MessageCircle
            className=""
            onClick={()=>handlePostComment()}/>
            <span>{post.comments.length} Comments</span>
          </div>
        {/* Comment input */}
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
  );
}
