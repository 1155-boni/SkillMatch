import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // 🔐 Check if admin login
    if (
      formData.email === "dietboni@gmail.com" &&
      formData.password === "SkillMatch1234"
    ) {
      const userData = {
        email: "dietboni@gmail.com",
        role: "admin",
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      window.dispatchEvent(new Event("loginUpdate"));
      navigate("/admin-dashboard");
      return;
    }

    // 🔍 Check regular users from Firestore
    try {
      const userRef = doc(db, "users", formData.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const user = userSnap.data();
        if (user.password === formData.password) {
          const userData = { email: user.email, role: user.role };
          localStorage.setItem("userData", JSON.stringify(userData));
          window.dispatchEvent(new Event("loginUpdate"));
          navigate(`/${user.role.toLowerCase()}-dashboard`);
        } else {
          setMessage("Invalid password.");
        }
      } else {
        setMessage("User not found.");
      }
    } catch (err) {
      setMessage("Login failed. Please try again.");
    }
  }

  return (
    <div className="w-[512px] py-5 mx-auto">
      <h2 className="text-[28px] font-bold text-center pb-3">
        Log in to your account
      </h2>
      {message && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="rounded-xl p-4 bg-[#f1f2f4] h-14"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="rounded-xl p-4 bg-[#f1f2f4] h-14"
          required
        />
        <button
          type="submit"
          className="rounded-full px-4 h-10 bg-[#c9daec] text-sm font-bold"
        >
          Log In
        </button>
      </form>
      <p className="text-sm text-center mt-2">
        Don’t have an account?{" "}
        <Link to="/signup" className="underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
