import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [message, setMessage] = useState(""); // <-- Add message state
  const [confirmDelete, setConfirmDelete] = useState(null); // <-- For user delete confirmation
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState({});

  const usersPerPage = 5;

  const adminEmail = "dietboni@gmail.com";

  useEffect(() => {
    // Listen for users
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList = [];
      const profiles = {};
      snapshot.forEach((doc) => {
        userList.push({ ...doc.data(), email: doc.id });
        profiles[doc.id] = doc.data();
      });
      setUsers(userList);
      setUserProfiles(profiles);
    });

    // Listen for jobs
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobList = [];
      snapshot.forEach((doc) => {
        jobList.push({ ...doc.data(), id: doc.id });
      });
      setJobs(jobList);
    });

    // Listen for bookings
    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bookingList = [];
      snapshot.forEach((doc) => {
        bookingList.push({ ...doc.data(), id: doc.id });
      });
      setBookings(bookingList);
    });

    return () => {
      unsubUsers();
      unsubJobs();
      unsubBookings();
    };
  }, []);

  const togglePassword = (email) => {
    setShowPassword((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  // Replace window.confirm with a custom confirmation message
  const handleDeleteUser = (email) => {
    setConfirmDelete(email);
  };

  const confirmDeleteUser = async (email) => {
    await deleteDoc(doc(db, "users", email));
    setMessage("User deleted.");
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

  // Filter out the admin from the users list
  const filteredUsers = users.filter((user) => user.email !== adminEmail);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100 max-w-[1100px] mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Show message if exists */}
      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {message}
          <button
            className="ml-2 text-blue-500 underline"
            onClick={() => setMessage("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Show custom confirm dialog for user deletion */}
      {confirmDelete && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex items-center justify-between">
          <span>
            Are you sure you want to delete user <b>{confirmDelete}</b>?
          </span>
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
                  {showPassword[user.email] ? user.password : "••••••••"}
                  <button
                    onClick={() => togglePassword(user.email)}
                    className="ml-2 text-blue-600 text-sm underline"
                  >
                    {showPassword[user.email] ? "Hide" : "Show"}
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
              className={`mx-1 px-3 py-1 rounded-full ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
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
          {jobs
            .filter((job) => job.isApproved)
            .map((job) => {
              const poster = userProfiles[job.postedBy];
              const jobBookings = bookings.filter((b) => b.jobId === job.id);
              return (
                <div key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl mb-4">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p>Salary: ${job.salary}</p>
                  {/* Poster profile */}
                  <div className="flex items-center gap-2 mb-2">
                    {poster && (
                      <a
                        href={`/profile/${job.postedBy}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            poster.profileImage ||
                            "https://via.placeholder.com/40?text=User"
                          }
                          alt={poster.username || job.postedBy}
                          className="w-8 h-8 rounded-full object-cover border"
                          title="View Poster Profile"
                        />
                      </a>
                    )}
                    <span className="text-sm text-gray-600">
                      Posted by: {poster?.username || job.postedBy}
                    </span>
                  </div>
                  {/* Bookings for this job */}
                  {jobBookings.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm mb-1">Booked by:</p>
                      <ul>
                        {jobBookings.map((b) => {
                          const freelancer = userProfiles[b.freelancer];
                          return (
                            <li
                              key={b.id}
                              className="flex items-center gap-2 mb-1"
                            >
                              {freelancer && (
                                <a
                                  href={`/profile/${b.freelancer}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={
                                      freelancer.profileImage ||
                                      "https://via.placeholder.com/32?text=User"
                                    }
                                    alt={freelancer.username || b.freelancer}
                                    className="w-6 h-6 rounded-full object-cover border"
                                    title="View Freelancer Profile"
                                  />
                                </a>
                              )}
                              <span className="text-sm">
                                {freelancer?.username || b.freelancer}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({b.status})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditClick(job)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleReject(job.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Jobs Pending Approval */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Jobs Pending Approval</h2>
          {jobs
            .filter((job) => !job.isApproved)
            .map((job) => {
              const poster = userProfiles[job.postedBy];
              const jobBookings = bookings.filter((b) => b.jobId === job.id);
              return (
                <div key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl mb-4">
                  <h3 className="text-lg font-bold">{job.title}</h3>
                  <p>{job.description}</p>
                  <p>Salary: ${job.salary}</p>
                  {/* Poster profile */}
                  <div className="flex items-center gap-2 mb-2">
                    {poster && (
                      <a
                        href={`/profile/${job.postedBy}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            poster.profileImage ||
                            "https://via.placeholder.com/40?text=User"
                          }
                          alt={poster.username || job.postedBy}
                          className="w-8 h-8 rounded-full object-cover border"
                          title="View Poster Profile"
                        />
                      </a>
                    )}
                    <span className="text-sm text-gray-600">
                      Posted by: {poster?.username || job.postedBy}
                    </span>
                  </div>
                  {/* Bookings for this job */}
                  {jobBookings.length > 0 && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm mb-1">Booked by:</p>
                      <ul>
                        {jobBookings.map((b) => {
                          const freelancer = userProfiles[b.freelancer];
                          return (
                            <li
                              key={b.id}
                              className="flex items-center gap-2 mb-1"
                            >
                              {freelancer && (
                                <a
                                  href={`/profile/${b.freelancer}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={
                                      freelancer.profileImage ||
                                      "https://via.placeholder.com/32?text=User"
                                    }
                                    alt={freelancer.username || b.freelancer}
                                    className="w-6 h-6 rounded-full object-cover border"
                                    title="View Freelancer Profile"
                                  />
                                </a>
                              )}
                              <span className="text-sm">
                                {freelancer?.username || b.freelancer}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({b.status})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleApprove(job.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(job.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
