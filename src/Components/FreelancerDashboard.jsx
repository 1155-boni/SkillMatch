import React from 'react';

function FreelancerDashboard() {
  return (
    <div className="w-[512px] max-w-[960px] py-5">
      <h2 className="text-[#121416] text-[28px] font-bold leading-tight px-4 text-center pb-3">Freelancer Dashboard</h2>
      <div className="px-4">
        <p>Welcome, showcase your skills and apply for gigs!</p>
        <input placeholder="Add skill" className="form-input w-full h-14 p-4 mb-4 bg-[#f1f2f4] rounded-xl" />
        <button className="bg-[#c9daec] rounded-full px-4 py-2 text-sm">View Applications</button>
      </div>
    </div>
  );
}

export default FreelancerDashboard;