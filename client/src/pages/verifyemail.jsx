import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthstore from "../store/auth-store";

export default function VerifyEmail() {
  const { verifyemail, loading, resendcode } = useAuthstore();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resendTimer, setResendTimer] = useState(0); // 0 = allowed

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || code.length !== 6) {
      setError("Please provide a valid 6-digit OTP.");
      return;
    }

    try {console.log(email,code)

      const message = await verifyemail( email, code );
      setSuccess(message);
      if(success)setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.message || "An unexpected error occurred.");
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const msg = await resendcode(email);
      setSuccess(msg);
      setResendTimer(120); // 2-minute cooldown
    } catch (err) {
      setError(err?.message || "Failed to resend code.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md md:max-w-lg bg-[#111] p-8 rounded-2xl shadow-2xl text-white space-y-6 border border-neutral-800"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Verify Email</h2>

        <p className="text-sm text-gray-400 text-center">
          Enter the 6-digit OTP sent to{" "}
          <span className="text-pink-500">{email}</span>
        </p>

        <div className="space-y-1">
          <label className="block text-sm text-gray-400">OTP</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            className="w-full px-4 py-2 bg-[#181818] text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 hover:bg-neutral-700 rounded-md text-white font-semibold transition-all duration-200"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <button
            onClick={handleSendCode}
            disabled={loading || resendTimer > 0}
            className={`flex-1 py-2 rounded-md font-semibold transition-all duration-200 ${
              resendTimer > 0
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-900 via-purple-900 to-blue-900 text-white hover:bg-neutral-700"
            }`}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Send OTP"}
          </button>
        </div>
      </form>
    </div>
  );
}
