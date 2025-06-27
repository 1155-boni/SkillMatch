import React, { useState, useEffect } from 'react';

function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem('userData'));
  const clientEmail = user?.email || '';

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    salary: '',
    category: 'Design',
    deadline: '',
  });

  const [editingJobId, setEditingJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(storedJobs.filter(job => job.postedBy === clientEmail));

    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(storedBookings);
  }, []);

  const handleChange = (event) => {
    setJobData({ ...jobData, [event.target.name]: event.target.value });
  };

  const handlePostJob = (event) => {
    event.preventDefault();
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
      ...jobData,
      id: Date.now(),
      postedBy: clientEmail,
    };
    const updatedJobs = [...allJobs, newJob];
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs.filter(job => job.postedBy === clientEmail));
    setJobData({ title: '', description: '', salary: '', category: 'Design', deadline: '' });
    alert('Job posted successfully!');
  };

  const handleEditJob = (jobId) => {
    const jobToEdit = jobs.find(job => job.id === jobId);
    if (jobToEdit) {
      setJobData(jobToEdit);
      setEditingJobId(jobId);
    }
  };

  const handleUpdateJob = (event) => {
    event.preventDefault();
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = allJobs.map(job =>
      job.id === editingJobId ? { ...jobData, id: job.id, postedBy: clientEmail } : job
    );
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs.filter(job => job.postedBy === clientEmail));
    setJobData({ title: '', description: '', salary: '', category: 'Design', deadline: '' });
    setEditingJobId(null);
    alert('Job updated successfully!');
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      const updatedJobs = allJobs.filter(job => job.id !== jobId);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      setJobs(updatedJobs.filter(job => job.postedBy === clientEmail));
      alert('Job deleted successfully!');
    }
  };

  const handleApprove = (jobId, freelancerEmail) => {
    const updatedBookings = bookings.map(b =>
      b.jobId === jobId && b.freelancer === freelancerEmail
        ? { ...b, status: 'Approved' }
        : b
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const handleReject = (jobId, freelancerEmail) => {
    const updatedBookings = bookings.filter(
      b => !(b.jobId === jobId && b.freelancer === freelancerEmail)
    );
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  const awaitingApproval = bookings.filter(b => {
    return jobs.some(j => j.id === b.jobId) && b.status === 'Awaiting Approval';
  });

  const approvedBookings = bookings.filter(b => {
    return jobs.some(j => j.id === b.jobId) && b.status === 'Approved';
  });

  return (
    <div className="w-full max-w-[960px] py-5 px-4">
      <h2 className="text-[28px] font-bold text-center pb-3">Client Dashboard</h2>

      {/* Job Form */}
      <form onSubmit={editingJobId ? handleUpdateJob : handlePostJob} className="flex flex-col gap-4 mb-6 bg-[#f9f9f9] p-4 rounded-xl">
        <input name="title" placeholder="Job title" value={jobData.title} onChange={handleChange} className="p-3 rounded bg-[#f1f2f4]" required />
        <textarea name="description" placeholder="Job description" value={jobData.description} onChange={handleChange} className="p-3 rounded bg-[#f1f2f4]" />
        <input name="salary" type="number" placeholder="Salary" value={jobData.salary} onChange={handleChange} className="p-3 rounded bg-[#f1f2f4]" />
        <select name="category" value={jobData.category} onChange={handleChange} className="p-3 rounded bg-[#f1f2f4]">
          <option value="Design">Design</option>
          <option value="Development">Development</option>
          <option value="Writing">Writing</option>
        </select>
        <input name="deadline" type="date" value={jobData.deadline} onChange={handleChange} className="p-3 rounded bg-[#f1f2f4]" />
        <button type="submit" className="bg-[#c9daec] px-4 py-2 rounded-full font-bold">
          {editingJobId ? 'Update Job' : 'Post Job'}
        </button>
      </form>

      {/* Job List */}
      <h3 className="text-xl font-semibold mb-2">Posted Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="p-4 bg-[#f1f2f4] rounded-xl">
              <strong>{job.title}</strong> - ${job.salary} - {job.category} - Deadline: {job.deadline || 'Not set'}
              <p>{job.description}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEditJob(job.id)} className="bg-yellow-400 px-3 py-1 rounded-full text-sm">Edit</button>
                <button onClick={() => handleDeleteJob(job.id)} className="bg-red-500 px-3 py-1 rounded-full text-white text-sm">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Bookings Awaiting Approval */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Bookings Awaiting Approval</h3>
        {awaitingApproval.length === 0 ? (
          <p>No bookings awaiting approval.</p>
        ) : (
          <ul className="space-y-3">
            {awaitingApproval.map((b, idx) => {
              const job = jobs.find(j => j.id === b.jobId);
              return (
                <li key={idx} className="bg-yellow-100 p-3 rounded">
                  <p><strong>{job?.title}</strong> booked by <em>{b.freelancer}</em></p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleApprove(b.jobId, b.freelancer)} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Approve</button>
                    <button onClick={() => handleReject(b.jobId, b.freelancer)} className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Reject</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Approved Bookings */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Approved Bookings</h3>
        {approvedBookings.length === 0 ? (
          <p>No approved bookings yet.</p>
        ) : (
          <ul className="space-y-3">
            {approvedBookings.map((b, idx) => {
              const job = jobs.find(j => j.id === b.jobId);
              return (
                <li key={idx} className="bg-green-100 p-3 rounded">
                  <p><strong>{job?.title}</strong> - Approved for <em>{b.freelancer}</em></p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
