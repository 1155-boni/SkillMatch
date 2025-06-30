import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function SignupForm() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
  });
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      // Check if user already exists in Firestore
      const userRef = doc(db, "users", formData.email);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setMessage("Email already registered!");
        return;
      }
      // Save user to Firestore
      await setDoc(userRef, {
        name: formData.name,
        email: formData.email,
        password: formData.password, // Note: Insecure, use Firebase Auth in production!
        role: formData.role,
      });
      // Store current user in 'userData' for session
      const userData = {
        email: formData.email,
        role: formData.role,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      window.dispatchEvent(new Event("loginUpdate"));
      navigate(`/${formData.role.toLowerCase()}-dashboard`);
    } catch (error) {
      setMessage(`Signup failed: ${error.message}`);
    }
  }

  return (
    <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
      <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
        Create your account
      </h2>
      {message && (
        <p className="text-[#ff4444] text-sm text-center px-4">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
        <input
          id="name"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          autoComplete="name"
          required
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          autoComplete="email"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          autoComplete="new-password"
          required
        />
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          autoComplete="new-password"
          required
        />
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 p-4 text-base font-normal leading-normal"
          required
        >
          <option value="freelancer">Freelancer (Student)</option>
          <option value="client">Client</option>
        </select>
        <button
          type="submit"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">Sign up</span>
        </button>
      </form>
      <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default SignupForm;
