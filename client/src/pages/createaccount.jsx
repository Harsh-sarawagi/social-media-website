import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/auth-store.js";

export default function CreateAccount() {
  const navigate = useNavigate();
  const { createAccount, loading, error } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    userID: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setLocalError("");

    if (!form.name || !form.userID || !form.email || !form.password) {
      setLocalError("All fields are required.");
      return;
    }

    const message = await createAccount(form);
    if (message) {
      setSuccess(message);
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
      }, 1000);
    }
    // If message is null, the error is set in the store and displayed below
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md md:max-w-lg bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_#1e1e1e] text-white space-y-6 border border-[#2a2a2a]"
  >
    <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
      Create Account
    </h2>

    <div className="space-y-1">
      <label className="block text-sm text-gray-400">Name</label>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm text-gray-400">User ID</label>
      <input
        type="text"
        name="userID"
        value={form.userID}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm text-gray-400">Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="space-y-1">
      <label className="block text-sm text-gray-400">Password</label>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {error && (
      <p className="text-red-500 text-sm text-center">
        {error}
      </p>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:opacity-90 rounded-md text-white font-semibold transition-all duration-300"
    >
      {loading ? "Creating..." : "Create Account"}
    </button>

    <p className="text-center text-sm text-gray-400">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-pink-400 hover:text-pink-500 underline transition duration-150"
      >
        Login
      </Link>
    </p>
  </form>
</div>

  );
}
