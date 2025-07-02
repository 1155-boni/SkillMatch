import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function UserProfile() {
  // Get email from route params (for viewing other profiles)
  const { email } = useParams();
  // Current logged-in user
  const currentUser = JSON.parse(localStorage.getItem("userData") || "{}");
  const fileInputRef = useRef();

  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    location: "",
    phone: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    profileImage: "",
    role: "",
  });
  const [message, setMessage] = useState("");
  const [notAllowed, setNotAllowed] = useState(false);
  const isOwnProfile = !email || email === currentUser.email;

  // Load profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      const profileEmail = email || currentUser.email;
      if (!profileEmail) return;
      const docRef = doc(db, "users", profileEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Prevent viewing admin profile unless current user is admin
        if (
          data.role === "admin" &&
          currentUser.role !== "admin"
        ) {
          setNotAllowed(true);
        } else {
          setProfile({
            username: data.username || "",
            bio: data.bio || "",
            location: data.location || "",
            phone: data.phone || "",
            instagram: data.instagram || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            profileImage: data.profileImage || "",
            role: data.role || "",
          });
        }
      } else {
        setProfile((prev) => ({ ...prev, username: "Not found" }));
      }
    };
    fetchProfile();
  }, [email, currentUser.email, currentUser.role]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files[0]) {
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
    if (!currentUser.email) return;
    await setDoc(
      doc(db, "users", currentUser.email),
      {
        ...profile,
        email: currentUser.email,
        role: currentUser.role,
      },
      { merge: true }
    );
    setMessage("Profile saved!");
    setTimeout(() => setMessage(""), 2000);
  };

  const triggerFilePicker = () => {
    fileInputRef.current.click();
  };

  if (notAllowed) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-red-600 font-bold">
        You are not allowed to view the admin's profile.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100 shadow rounded-xl p-6 my-10 border border-gray-200">
      <h2 className="text-xl font-semibold text-[#121416] mb-4">
        {isOwnProfile ? "User Profile" : `${profile.username}'s Profile`}
      </h2>

      {/* Profile Image Upload with Hover Camera */}
      <div className="relative w-28 h-28 mx-auto mb-6 group">
        <img
          src={
            profile.profileImage || "https://via.placeholder.com/150?text=Photo"
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border shadow"
        />
        {isOwnProfile && (
          <>
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
          </>
        )}
      </div>

      {/* Profile Form or Readonly */}
      {isOwnProfile ? (
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
            name="instagram"
            placeholder="Instagram Username"
            value={profile.instagram}
            onChange={handleChange}
            className="form-input bg-[#f1f2f4] rounded-xl p-3"
          />
          <input
            type="text"
            name="twitter"
            placeholder="Twitter Username"
            value={profile.twitter}
            onChange={handleChange}
            className="form-input bg-[#f1f2f4] rounded-xl p-3"
          />
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn Username"
            value={profile.linkedin}
            onChange={handleChange}
            className="form-input bg-[#f1f2f4] rounded-xl p-3"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <b>Bio:</b> {profile.bio}
          </div>
          <div>
            <b>Location:</b> {profile.location}
          </div>
          <div>
            <b>Phone:</b> {profile.phone}
          </div>
        </div>
      )}

      {isOwnProfile && (
        <button
          onClick={handleSave}
          className="mt-6 bg-[#c9daec] text-[#121416] font-semibold py-2 px-4 rounded-full hover:bg-[#a3c6e0] transition"
        >
          Save Profile
        </button>
      )}
      {message && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded text-center">
          {message}
        </div>
      )}

      {/* Social Links */}
      <div className="flex gap-4 mt-4">
        {profile.instagram && (
          <a
            href={`https://instagram.com/${profile.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 text-2xl"
            title="Instagram"
          >
            <FaInstagram />
          </a>
        )}
        {profile.twitter && (
          <a
            href={`https://twitter.com/${profile.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-2xl"
            title="Twitter"
          >
            <FaTwitter />
          </a>
        )}
        {profile.linkedin && (
          <a
            href={`https://linkedin.com/in/${profile.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-2xl"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
