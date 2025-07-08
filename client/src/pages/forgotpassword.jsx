import { useState } from 'react';
// import axios from 'axios';
import API from '../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await API.post(`/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleForgotPassword}
        className=" bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_#1e1e1e] text-white space-y-6 border border-[#2a2a2a]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded bg-black border border-pink-500 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold py-2 px-4 rounded hover:opacity-90"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-pink-400">{message}</p>
        )}
      </form>
    </div>
  );
}
