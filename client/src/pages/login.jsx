import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.email || !form.password) {
      setFormError("All fields are required.");
      return;
    }

    const { user, error } = await login(form); // destructure result
    console.log(error)
  if (user) {
    navigate("/");
  } else if (error === "Email not verified") {
    navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
  } else {
    setFormError(error);
  }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md md:max-w-lg bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_#1e1e1e] text-white space-y-6 border border-[#2a2a2a]"
  >
    <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
      Login
    </h2>

    <div className="space-y-1">
      <label className="block text-sm text-gray-400">Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Enter your email"
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
        className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="Enter your password"
      />
    </div>

    {(formError || error) && (
      <p className="text-red-500 text-sm text-center">{formError || error}</p>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:opacity-90 rounded-md text-white font-semibold transition-all duration-300"
    >
      {loading ? "Logging in..." : "Login"}
    </button>
    <p className="text-center text-sm text-gray-400">
      Forgot password?{" "}
      <span
        onClick={() => navigate("/forgotpassword")}
        className="text-pink-400 hover:text-pink-500 underline transition duration-150 cursor-pointer"
      >
        Reset
      </span>
    </p>
    <p className="text-center text-sm text-gray-400">
      Don’t have an account?{" "}
      <span
        onClick={() => navigate("/signup")}
        className="text-pink-400 hover:text-pink-500 underline transition duration-150 cursor-pointer"
      >
        Create one
      </span>
    </p>
  </form>
</div>

  );
}
