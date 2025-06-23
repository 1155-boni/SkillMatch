import React, { useState } from 'react';

function ClientDashboard() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    salary: '',
    category: 'Design',
    deadline: '',
  });
  const [editingJobId, setEditingJobId] = useState(null);

  const handleChange = (event) => {
    setJobData({ ...jobData, [event.target.name]: event.target.value });
  };

  const handlePostJob = (event) => {
    event.preventDefault();
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
      ...jobData,
      id: Date.now(),
      postedBy: JSON.parse(localStorage.getItem('userData'))?.email || 'Unknown',
      bookedBy: null,
      approved: false,
    };
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    setJobData({ title: '', description: '', salary: '', category: 'Design', deadline: '' });
    alert('Job posted successfully!');
  };

  const handleEditJob = (jobId) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const jobToEdit = jobs.find((job) => job.id === jobId);
    if (jobToEdit) {
      setJobData(jobToEdit);
      setEditingJobId(jobId);
    }
  };

  const handleUpdateJob = (event) => {
    event.preventDefault();
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = jobs.map((job) =>
      job.id === editingJobId ? { ...job, ...jobData } : job
    );
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobData({ title: '', description: '', salary: '', category: 'Design', deadline: '' });
    setEditingJobId(null);
    alert('Job updated successfully!');
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = jobs.filter((job) => job.id !== jobId);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      alert('Job deleted successfully!');
    }
  };

  const handleApproveBooking = (jobId) => {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, approved: true } : job
    );
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    alert('Booking approved!');
    window.location.reload(); // Optional: trigger re-render
  };

  const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');

  return (
    <div className="w-[512px] max-w-[960px] py-5">
      <h2 className="text-[#121416] text-[28px] font-bold text-center pb-3">Client Dashboard</h2>
      <div className="px-4">
        <p>Post a new job or manage your hires!</p>
        <form onSubmit={editingJobId ? handleUpdateJob : handlePostJob} className="flex flex-col gap-4 mt-4">
          <input
            name="title"
            placeholder="Job title"
            value={jobData.title}
            onChange={handleChange}
            className="form-input w-full h-14 p-4 bg-[#f1f2f4] rounded-xl"
          />
          <textarea
            name="description"
            placeholder="Job description"
            value={jobData.description}
            onChange={handleChange}
            className="form-input w-full h-24 p-4 bg-[#f1f2f4] rounded-xl resize-none"
          />
          <input
            name="salary"
            type="number"
            placeholder="Salary (e.g., 50)"
            value={jobData.salary}
            onChange={handleChange}
            className="form-input w-full h-14 p-4 bg-[#f1f2f4] rounded-xl"
          />
          <select
            name="category"
            value={jobData.category}
            onChange={handleChange}
            className="form-input w-full h-14 p-4 bg-[#f1f2f4] rounded-xl"
          >
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Writing">Writing</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            name="deadline"
            type="date"
            value={jobData.deadline}
            onChange={handleChange}
            className="form-input w-full h-14 p-4 bg-[#f1f2f4] rounded-xl"
          />
          <button
            type="submit"
            className="bg-[#c9daec] rounded-full px-4 py-2 text-sm hover:bg-[#a3c6e0] transition-colors"
          >
            {editingJobId ? 'Update Job' : 'Post Job'}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-medium">Posted Jobs</h3>
          <ul className="list-disc pl-5 mt-2 space-y-4">
            {jobs.length === 0 && <p className="text-[#6a7581]">No jobs posted yet.</p>}
            {jobs.map((job) => (
              <li key={job.id} className="text-[#6a7581] mb-2 bg-[#f9f9f9] p-4 rounded-xl">
                <strong className="text-[#121416]">{job.title}</strong> — ${job.salary} — {job.category}
                <p className="text-sm">{job.description}</p>
                <p className="text-sm">Deadline: {job.deadline || 'Not set'}</p>

                {job.bookedBy && (
                  <p className="text-sm text-blue-700 mt-2">
                    Booked by: {job.bookedBy} — {job.approved ? '✅ Approved' : '⏳ Pending'}
                    {!job.approved && (
                      <button
                        onClick={() => handleApproveBooking(job.id)}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    )}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEditJob(job.id)}
                    className="bg-[#f1f2f4] rounded-full px-3 py-1 text-sm hover:bg-[#d9dcdf] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="bg-[#ff4444] rounded-full px-3 py-1 text-sm text-white hover:bg-[#cc0000] transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
