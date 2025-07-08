import React, { useEffect, useState } from "react";
import useAuthstore from "../store/auth-store";
// import Navbar from "../components/navbar";
import API from "../api/api";

export default function EditProfile() {
  const { user } = useAuthstore();

  const DEFAULT_PLACEHOLDER =
    "https://res.cloudinary.com/deozgtnxg/image/upload/v1749653562/profilepicplaceholder_dqgx54.png";

  const [form, setForm] = useState({
    name: "",
    bio: "",
    previewUrl: "",
    newFile: null,
  });

  const [initialData, setInitialData] = useState(null);
  const [shouldDeleteOldPic, setShouldDeleteOldPic] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadState, setUploadState] = useState({
    image_url: "",
    public_id: "",
  });
  const [isloading,setisloading] = useState(false)

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || "",
        bio: user.bio || "",
        profilepicture: user.profilepicture || "",
        public_id: user.profilepicturepublicid || "",
      };
      setForm({
        name: data.name,
        bio: data.bio,
        previewUrl: data.profilepicture,
        newFile: null,
      });
      setInitialData(data);
      setShouldDeleteOldPic(false);
      setHasChanges(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialData) {
      const changed =
        form.name !== initialData.name ||
        form.bio !== initialData.bio ||
        form.newFile !== null ||
        (form.previewUrl !== initialData.profilepicture && !form.newFile);
      setHasChanges(changed);
    }
  }, [form, initialData]);

  const uploadimage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await API.post("/upload/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

  const { imageUrl, public_id } = res.data;
  return { imageUrl, public_id }; // ✅ return the data
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

  const savechanges = async (updatedData) => {
    console.log(updatedData)
  try {
    await API.patch("/profile/edit", updatedData, { withCredentials: true });
  } catch (err) {
    console.error("Error saving profile changes:", err);
  }
};

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Clean up old object URL if exists
  if (form.previewUrl && form.newFile) {
    URL.revokeObjectURL(form.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  setForm((prev) => ({
    ...prev,
    newFile: file,
    previewUrl,
  }));

  setShouldDeleteOldPic(true);

  // Important: reset previous upload state
  setUploadState({
    image_url: "",
    public_id: "",
  });
};


  const handleRemove = () => {
    const confirm = window.confirm("Are you sure you want to remove your profile picture?");
    if (!confirm) return;
    setForm((prev) => ({
      ...prev,
      newFile: null,
      previewUrl: "",
    }));
    setShouldDeleteOldPic(true);
  };

  const handleCancel = () => {
    if (!initialData) return;
    setForm({
      name: initialData.name,
      bio: initialData.bio,
      previewUrl: initialData.profilepicture,
      newFile: null,
    });
    setUploadState({
      image_url: "",
      public_id: "",
    });
    setShouldDeleteOldPic(false);
    setHasChanges(false);
  };
  const handleSave = async () => {

  try {
    setisloading(true)
    let newUrl = form.previewUrl;
    let newPublicId = initialData.public_id;

    if (form.newFile) {
      const { imageUrl, public_id } = await uploadimage(form.newFile); // ✅ use return value
      newUrl = imageUrl;
      newPublicId = public_id;
    }

    if (shouldDeleteOldPic && initialData.public_id) {
      await deleteimage(initialData.public_id);
    }

    const updatedData = {
      name: form.name,
      bio: form.bio,
      profilepicture: newUrl || "",
      profilepicturepublicid: newUrl ? newPublicId : "",
    };

    await savechanges(updatedData);

    setInitialData({
      name: updatedData.name,
      bio: updatedData.bio,
      profilepicture: updatedData.profilepicture,
      public_id: updatedData.profilepicturepublicid,
    });

    setForm({
      name: updatedData.name,
      bio: updatedData.bio,
      previewUrl: updatedData.profilepicture,
      newFile: null,
    });
    setUploadState({
      image_url: "",
      public_id: "",
    });
    setShouldDeleteOldPic(false);
    setHasChanges(false);
    setisloading(false);
  } catch (err) {
    console.error("Save error:", err);
  }
};


  return (
    <div className="flex justify-center bg-black min-h-screen w-full text-white">
  <div className="w-full max-w-4xl px-4 sm:px-8 py-6 sm:py-10">
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-8">
      <img
        src={form.previewUrl || DEFAULT_PLACEHOLDER}
        alt="Profile Preview"
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-pink-500"
      />

      <div className="flex flex-col gap-2">
        <label className="bg-blue-800 px-4 py-1 rounded-md cursor-pointer hover:bg-blue-700 text-sm text-center">
          Change picture
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>

        {form.previewUrl && (
          <button
            onClick={handleRemove}
            className="bg-red-700 px-4 py-1 rounded-md text-sm hover:bg-red-600"
          >
            Remove picture
          </button>
        )}
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Bio</label>
        <textarea
          rows="3"
          value={form.bio}
          onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
          className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
    </div>

    <div className="flex justify-end gap-4 mt-6 flex-wrap">
      <button
        onClick={handleCancel}
        className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        disabled={!hasChanges || isloading}
        className={`px-4 py-2 rounded-md ${
          hasChanges ? "bg-blue-700 hover:bg-blue-600" : "bg-zinc-600 cursor-not-allowed"
        }`}
      >
        Save
      </button>
    </div>
  </div>
</div>

  );
}
