import React, { useEffect, useState } from 'react';

function SettingsPage() {
  const user = JSON.parse(localStorage.getItem('userData') || '{}');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('app-language') || 'en');

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const handleDeleteAccount = () => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    delete users[user.email];
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('userData');
    localStorage.removeItem(`profile-${user.email}`);
    alert('Account deleted');
    window.location.href = '/';
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#121416]">Account Settings</h1>

      {/* Password Update */}
      <div className="mb-6">
        <label className="block font-medium mb-1">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input w-full bg-[#f1f2f4] p-3 rounded-xl pr-10"
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-[#6a7581]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="form-select w-full bg-[#f1f2f4] p-3 rounded-xl"
        >
          <option value="en">English</option>
          <option value="sw">Swahili</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Delete Account */}
      <div className="mb-6">
        <button
          onClick={handleDeleteAccount}
          className="bg-[#ff4444] hover:bg-[#cc0000] text-white px-6 py-2 rounded-full font-semibold"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
