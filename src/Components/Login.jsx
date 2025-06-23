import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Check against persistent users store
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[formData.email];
    if (user) {
      console.log('Found user:', user);
      if (user.password === formData.password) {
        // Store current user in userData for session
        const userData = {
          email: user.email,
          role: user.role,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        window.dispatchEvent(new Event('loginUpdate'));
        console.log('Login successful for role:', user.role);
        navigate(`/${user.role.toLowerCase()}-dashboard`);
      } else {
        console.log('Login failed: Incorrect password');
        alert('Invalid email or password');
      }
    } else {
      console.log('Login failed: No user found');
      alert('No account found. Please sign up first.');
    }
  }

  return (
    <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
      <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Log in to your account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          required
        />
        <button
          type="submit"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">Log In</span>
        </button>
      </form>
      <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginForm;