import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const usersPerPage = 5;

  const adminEmail = "dietboni@gmail.com";

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const userList = Object.values(allUsers).filter(user => user.email !== adminEmail);
    setUsers(userList);

    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(allJobs);
  }, []);

  const togglePassword = (email) => {
    setShowPassword((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  const handleDeleteUser = (email) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const allUsers = JSON.parse(localStorage.getItem("users") || "{}");
      delete allUsers[email];
      localStorage.setItem("users", JSON.stringify(allUsers));
      setUsers(Object.values(allUsers).filter(user => user.email !== adminEmail));
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setEditedJob({ ...job });
  };

  const handleJobChange = (e) => {
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
  };

  const handleSaveJob = () => {
    const updatedJobs = jobs.map(job => job.id === editingJobId ? editedJob : job);
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setEditingJobId(null);
    alert("Job updated successfully");
  };

  const handleApprove = (jobId) => {
    const updatedJobs = jobs.map(job => job.id === jobId ? { ...job, isApproved: true } : job);
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  const handleReject = (jobId) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="max-w-[1100px] mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Users List</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Password</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {showPassword[user.email] ? user.password : '••••••••'}
                  <button
                    onClick={() => togglePassword(user.email)}
                    className="ml-2 text-blue-600 text-sm underline"
                  >
                    {showPassword[user.email] ? 'Hide' : 'Show'}
                  </button>
                </td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteUser(user.email)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded-full ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Approved Jobs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Approved Jobs</h2>
          {jobs.filter(job => job.isApproved).map((job) => (
            <div key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl mb-4">
              {editingJobId === job.id ? (
                <>
                  <input name="title" value={editedJob.title} onChange={handleJobChange} className="w-full mb-2 p-2 rounded" />
                  <textarea name="description" value={editedJob.description} onChange={handleJobChange} className="w-full mb-2 p-2 rounded" />
                  <input name="salary" value={editedJob.salary} onChange={handleJobChange} className="w-full mb-2 p-2 rounded" />
                  <button onClick={handleSaveJob} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Save</button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p>Salary: ${job.salary}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleEditClick(job)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleReject(job.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Jobs Pending Approval */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Jobs Pending Approval</h2>
          {jobs.filter(job => !job.isApproved).map((job) => (
            <div key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl mb-4">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p>{job.description}</p>
              <p>Salary: ${job.salary}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleApprove(job.id)} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={() => handleReject(job.id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
