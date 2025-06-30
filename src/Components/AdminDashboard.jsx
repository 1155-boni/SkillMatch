import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc
} from 'firebase/firestore';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [message, setMessage] = useState(''); // <-- Add message state
  const [confirmDelete, setConfirmDelete] = useState(null); // <-- For user delete confirmation
  const usersPerPage = 5;

  const adminEmail = "dietboni@gmail.com";

  useEffect(() => {
    // Listen for users
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = [];
      snapshot.forEach(doc => {
        if (doc.id !== adminEmail) {
          userList.push({ ...doc.data(), email: doc.id });
        }
      });
      setUsers(userList);
    });

    // Listen for jobs
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobList = [];
      snapshot.forEach(doc => {
        jobList.push({ ...doc.data(), id: doc.id });
      });
      setJobs(jobList);
    });

    return () => {
      unsubUsers();
      unsubJobs();
    };
  }, []);

  const togglePassword = (email) => {
    setShowPassword((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  // Replace window.confirm with a custom confirmation message
  const handleDeleteUser = (email) => {
    setConfirmDelete(email);
  };

  const confirmDeleteUser = async (email) => {
    await deleteDoc(doc(db, "users", email));
    setMessage('User deleted.');
    setConfirmDelete(null);
  };

  const cancelDeleteUser = () => {
    setConfirmDelete(null);
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setEditedJob({ ...job });
  };

  const handleJobChange = (e) => {
    setEditedJob({ ...editedJob, [e.target.name]: e.target.value });
  };

  // Replace alert with a message
  const handleSaveJob = async () => {
    await updateDoc(doc(db, "jobs", editingJobId), editedJob);
    setEditingJobId(null);
    setMessage("Job updated successfully.");
  };

  const handleApprove = async (jobId) => {
    await updateDoc(doc(db, "jobs", jobId), { isApproved: true });
    setMessage("Job approved.");
  };

  const handleReject = async (jobId) => {
    await deleteDoc(doc(db, "jobs", jobId));
    setMessage("Job rejected or deleted.");
  };

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = users.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="max-w-[1100px] mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Show message if exists */}
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
          <button
            className="ml-2 text-blue-500 underline"
            onClick={() => setMessage('')}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Show custom confirm dialog for user deletion */}
      {confirmDelete && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex items-center justify-between">
          <span>Are you sure you want to delete user <b>{confirmDelete}</b>?</span>
          <div>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded mr-2"
              onClick={() => confirmDeleteUser(confirmDelete)}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={cancelDeleteUser}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
