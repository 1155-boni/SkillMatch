import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function UserProfile() {
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const fileInputRef = useRef();

  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    location: '',
    phone: '',
    socialLinks: '',
    profileImage: '',
  });
  const [message, setMessage] = useState('');

  // Load profile from Firestore
  useEffect(() => {
    if (!user.email) return;
    const fetchProfile = async () => {
      const docRef = doc(db, 'users', user.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          username: data.username || '',
          bio: data.bio || '',
          location: data.location || '',
          phone: data.phone || '',
          socialLinks: data.socialLinks || '',
          profileImage: data.profileImage || '',
        });
      }
    };
    fetchProfile();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result;
        setProfile((prev) => ({
          ...prev,
          profileImage: imageDataUrl,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!user.email) return;
    await setDoc(doc(db, 'users', user.email), {
      ...profile,
      email: user.email,
      role: user.role,
    }, { merge: true });
    setMessage('Profile saved!');
    setTimeout(() => setMessage(''), 2000);
  };

  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6 my-10 border border-gray-200">
      <h2 className="text-xl font-semibold text-[#121416] mb-4">User Profile</h2>

      {/* Profile Image Upload with Hover Camera */}
      <div className="relative w-28 h-28 mx-auto mb-6 group">
        <img
          src={
            profile.profileImage ||
            'https://via.placeholder.com/150?text=Photo'
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border shadow"
        />
        <div
          onClick={triggerFilePicker}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white text-2xl"
          title="Change Photo"
        >
          📷
        </div>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={profile.username}
          onChange={handleChange}
          className="form-input bg-[#f1f2f4] rounded-xl p-3"
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={profile.bio}
          onChange={handleChange}
          className="form-textarea bg-[#f1f2f4] rounded-xl p-3 h-24 resize-none"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={profile.location}
          onChange={handleChange}
          className="form-input bg-[#f1f2f4] rounded-xl p-3"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={handleChange}
          className="form-input bg-[#f1f2f4] rounded-xl p-3"
        />
        <input
          type="text"
          name="socialLinks"
          placeholder="Social Links (e.g. @username or full URL)"
          value={profile.socialLinks}
          onChange={handleChange}
          className="form-input bg-[#f1f2f4] rounded-xl p-3"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-[#c9daec] text-[#121416] font-semibold py-2 px-4 rounded-full hover:bg-[#a3c6e0] transition"
      >
        Save Profile
      </button>
      {message && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded text-center">
          {message}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
