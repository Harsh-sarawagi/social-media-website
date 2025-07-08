import { useState } from 'react';
import API from '../api/api';
// import useAuthstore from '../store/auth-store';
import VerticalNavbar from '../components/navbar';

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [caption, setCaption] = useState('');
const [isloading,setisloading] =useState(false)
// const { user } = useAuthstore();

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/upload/upload", formData, {
    timeout: 30000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  const { imageUrl, public_id } = res.data;
  return { imageUrl, public_id };
};

const handleCreatePost = async () => {
  setisloading(true);
  try {
    let uploadedImage = { imageUrl: "", public_id: "" };

    if (imageFile) {
      uploadedImage = await uploadImage(imageFile);
    }

    await API.post(
      "/post/create",
      {
        caption,
        image: {
          url: uploadedImage.imageUrl,
          public_id: uploadedImage.public_id,
        },
      },
      { withCredentials: true }
    );

    // Reset form
    setImageFile(null);
    setImagePreview(null);
    setCaption('');
    alert('Post created successfully');
  } catch (err) {
    console.error("Error creating post:", err);
    alert('Failed to create post');
  } finally {
    // Always stop loading regardless of success or failure
    setisloading(false);
  }
};

  return (
  <div className="flex flex-col min-h-screen w-screen bg-black">
  <div className="flex flex-col md:flex-row w-full h-full">
    <VerticalNavbar />

    <div className="flex-1 flex items-center justify-center p-10">
      <div className="flex flex-col md:flex-row bg-gray-900 rounded-2xl shadow-lg overflow-hidden w-full max-w-xl md:max-w-3xl">
        
        {/* Image Upload Section */}
        <div className="w-full md:w-2/3 aspect-square md:aspect-[1/1] bg-gradient-to-br rounded-2xl from-zinc-800 via-zinc-700 to-black flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="text-center text-white cursor-pointer hover:underline w-full h-full flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              Click to upload image
            </label>
          )}
        </div>

        {/* Caption and Button Section */}
        <div className="w-full md:w-1/3 p-4 bg-black md:p-6 flex flex-col justify-between">
          <textarea
            placeholder="Write your caption..."
            className="w-full h-32 md:h-48 p-4 rounded-lg bg-black border border-pink-500 text-white resize-none mb-4"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>

          <button disabled={isloading}
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:opacity-90"
          >
            {isloading? "Creating post..":"Create Post"}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}