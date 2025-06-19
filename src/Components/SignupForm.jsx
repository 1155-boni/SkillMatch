import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log('Input changed:', { [event.target.name]: event.target.value }); // Track each change
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      console.log('Initiating save, formData:', formData); // Log before save
      const userDataString = JSON.stringify(formData);
      console.log('Stringified data for save:', userDataString); // Log stringified data
      localStorage.setItem('userData', userDataString);
      const savedData = localStorage.getItem('userData');
      console.log('Verification after save:', savedData ? JSON.parse(savedData) : 'No data saved');
      if (!savedData) {
        throw new Error('localStorage save failed');
      }
      // Add a manual confirmation step
      if (window.confirm('Data saved. Proceed to dashboard?')) {
        console.log('User confirmed, navigating to:', `/${formData.role.toLowerCase()}-dashboard`);
        navigate(`/${formData.role.toLowerCase()}-dashboard`);
      } else {
        console.log('User canceled navigation, current data:', localStorage.getItem('userData'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Save failed. Error: ${error.message}. Check console for details.`);
    }
  }

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer',
  });

  useEffect(() => {
    console.log('Component state updated, formData:', formData);
  }, [formData]);

  return (
    <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
      <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create your account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4">
        <input
          id="name"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
          autoComplete="name"
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
        />
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 p-4 text-base font-normal leading-normal"
        >
          <option value="freelancer">Freelancer (Student)</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Sign up</span>
        </button>
      </form>
      <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
}

export default SignupForm;