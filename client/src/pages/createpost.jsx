import { useState } from 'react';
import API from '../api/api';
// import useAuthstore from '../store/auth-store';
import VerticalNavbar from '../components/navbar';

export default function CreatePost() {
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [caption, setCaption] = useState('');
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
  }
};

  return (
    <div className='flex w-screen bg-black'>
        <VerticalNavbar/>
        <div className="min-h-screen pl-[6rem] bg-black text-white p-4 flex items-center justify-center">
      <div className="flex bg-gray-900 rounded-2xl shadow-lg overflow-hidden w-[65vw]">
        <div className="w-2/3 h-[80vh] bg-gradient-to-br from-pink-900 to-blue-800 flex items-center justify-center object-cover">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full  object-cover"
            />
          ) : (
            <label className="text-center text-white cursor-pointer hover:underline object-cover">
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

        <div className="w-1/3 p-6 flex flex-col justify-between">
          <textarea
            placeholder="Write your caption..."
            className="w-full h-48 p-4 rounded-lg bg-black border border-pink-500 text-white resize-none mb-4"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>

          <button
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-pink-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:opacity-90"
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
