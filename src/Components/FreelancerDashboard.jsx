import React, { useEffect, useState } from 'react';

function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem('userData')) || { email: 'freelancer@example.com' };

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(storedJobs);
  }, []);

  const handleBookJob = (jobId) => {
    const updatedJobs = jobs.map(job =>
      job.id === jobId && !job.bookedBy
        ? { ...job, bookedBy: user.email, approved: false }
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    alert('Job booked! Wait for client approval.');
  };

  return (
    <div className="w-[512px] max-w-[960px] py-5">
      <h2 className="text-[#121416] text-[28px] font-bold text-center pb-3">Freelancer Dashboard</h2>
      <div className="px-4">
        <p className="mb-4">Welcome, {user.email}! Browse and book gigs.</p>

        <h3 className="text-lg font-semibold mb-2">Available Jobs</h3>
        {jobs.filter(job => !job.bookedBy).length === 0 ? (
          <p>No open jobs available at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {jobs
              .filter(job => !job.bookedBy)
              .map(job => (
                <li key={job.id} className="p-4 bg-[#f1f2f4] rounded-xl">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm">{job.description}</p>
                  <p className="text-sm text-[#6a7581]">Salary: ${job.salary}</p>
                  <p className="text-sm text-[#6a7581]">Category: {job.category}</p>
                  <p className="text-sm text-[#6a7581]">Deadline: {job.deadline}</p>
                  <button
                    onClick={() => handleBookJob(job.id)}
                    className="mt-2 bg-[#4CAF50] text-white px-3 py-1 rounded-full text-sm hover:bg-[#43a047]"
                  >
                    Book This Job
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
