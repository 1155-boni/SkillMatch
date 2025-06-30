import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function Settings() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('userData') || '{}');

  const handlePasswordChange = async () => {
    if (!user.email) {
      setMessage('User not found.');
      return;
    }
    try {
      const userRef = doc(db, 'users', user.email);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, { password });
        setMessage('Password updated!');
        setPassword('');
      } else {
        setMessage('User not found.');
      }
    } catch (err) {
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-xl font-bold mb-6 text-[#121416]">Settings</h2>

      {/* Show message if exists */}
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded text-center">
          {message}
        </div>
      )}

      {/* Update Password Section */}
      <div className="mb-6">
        <label className="block text-[#121416] font-medium mb-2">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full bg-[#f1f2f4] rounded-xl p-3 pr-10"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button
          onClick={handlePasswordChange}
          className="mt-4 bg-[#c9daec] text-[#121416] font-semibold py-2 px-4 rounded-full hover:bg-[#a3c6e0]"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Settings;
