import { useState } from 'react';
// import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    

    try {
        if (newPassword !== ConfirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
      const res = await API.post(`/auth/reset-password/${token}`, {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleResetPassword}
        className=" bg-[#111] p-8 rounded-2xl shadow-[0_0_30px_#1e1e1e] text-white space-y-6 border border-[#2a2a2a]"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 mb-4 rounded bg-black border border-pink-500 text-white"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 mb-4 rounded bg-black border border-pink-500 text-white"
          value={ConfirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-blue-600 text-white font-bold py-2 px-4 rounded hover:opacity-90"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-pink-400">{message}</p>
        )}
      </form>
    </div>
  );
}

