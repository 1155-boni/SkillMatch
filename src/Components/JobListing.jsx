import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

function JobListing() {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAuthorized =
    user && ["freelancer", "admin", "client"].includes(user.role);
  const isFreelancer = user && user.role === "freelancer";
  const canPostJob = user && user.role === "client"; // ✅ Only clients can post jobs

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    design: "",
    deadline: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobList = [];
      snapshot.forEach((doc) => jobList.push({ ...doc.data(), id: doc.id }));
      setJobs(jobList);
    });
    return () => unsub();
  }, []);

  // If you want to show only the current client's jobs:
  const clientJobs = jobs.filter((job) => job.postedBy === user.email);

  // If you want to show all jobs, use `jobs` instead of `clientJobs` below

  // For the main job listing (visible to all authorized users)
  const filteredJobs = jobs
    .filter((job) => !job.isBooked) // Only show jobs that are not booked
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newJob = {
      ...formData,
      postedBy: user.email,
      postedDate: new Date().toISOString().split("T")[0],
      isBooked: false, // <-- Add this line
    };
    await addDoc(collection(db, "jobs"), newJob);
    setFormData({
      title: "",
      description: "",
      salary: "",
      design: "",
      deadline: "",
    });
    alert("Job posted successfully!");
  };

  const handleBid = async (jobId, jobTitle) => {
    // Mark job as booked
    await updateDoc(doc(db, "jobs", jobId), { isBooked: true });
    alert(`Bid placed on job: ${jobTitle} (ID: ${jobId})`);
  };

  const handleCancelBooking = async (jobId) => {
    // Cancel the booking
    await updateDoc(doc(db, "jobs", jobId), { isBooked: false });
    alert(`Booking cancelled for job ID: ${jobId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100">
      <div className="layout-content-container flex flex-col w-full max-w-[960px] py-10 px-4">
        <h1 className="text-[#121416] text-[32px] font-bold leading-tight mb-6">
          Job Listings
        </h1>
        <p className="text-[#6a7581] text-lg leading-relaxed mb-6">
          Browse available opportunities or post a new job (clients only).
        </p>

        {/* Job Posting Form */}
        {canPostJob ? (
          <div className="bg-[#f1f2f4] p-6 rounded-xl mb-8">
            <h2 className="text-[#121416] text-xl font-semibold mb-4">
              Post a Job
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="title"
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={handleChange}
                className="form-input rounded-xl bg-white h-14 p-4"
                required
              />
              <textarea
                name="description"
                placeholder="Job Description"
                value={formData.description}
                onChange={handleChange}
                className="form-input rounded-xl bg-white h-24 p-4"
                required
              />
              <input
                name="salary"
                type="text"
                placeholder="Salary (e.g., 50)"
                value={formData.salary}
                onChange={handleChange}
                className="form-input rounded-xl bg-white h-14 p-4"
                required
              />
              <input
                name="design"
                type="text"
                placeholder="Design (e.g., UI/UX)"
                value={formData.design}
                onChange={handleChange}
                className="form-input rounded-xl bg-white h-14 p-4"
                required
              />
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input rounded-xl bg-white h-14 p-4"
                required
              />
              <button
                type="submit"
                className="bg-[#4CAF50] text-white font-bold rounded-full h-10 px-6 hover:bg-green-600 transition"
              >
                Post Job
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#f1f2f4] p-6 rounded-xl mb-8">
            <p className="text-[#6a7581] text-base">
              Only clients can post jobs.{" "}
              {user?.email ? (
                "Your account does not have permission."
              ) : (
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              )}
            </p>
          </div>
        )}

        {/* Job Listings */}
        <div>
          <h2 className="text-[#121416] text-xl font-semibold mb-4">
            Available Jobs
          </h2>
          {isAuthorized ? (
            <>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input rounded-xl bg-white h-14 p-4 mb-6 w-full"
              />
              {filteredJobs.length === 0 ? (
                <p className="text-[#6a7581]">No jobs found.</p>
              ) : (
                <ul className="space-y-4">
                  {filteredJobs.map((job) => (
                    <li key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl">
                      <h3 className="text-[#121416] font-semibold">
                        {job.title}
                      </h3>
                      <p className="text-[#6a7581] text-sm">{job.description}</p>
                      <p className="text-[#6a7581] text-sm">
                        Salary: {job.salary}
                      </p>
                      <p className="text-[#6a7581] text-sm">
                        Design: {job.design}
                      </p>
                      <p className="text-[#6a7581] text-sm">
                        Deadline: {job.deadline}
                      </p>
                      <p className="text-[#6a7581] text-sm">
                        Posted: {job.postedDate}
                      </p>
                      {isFreelancer && (
                        <button
                          onClick={() => handleBid(job.id, job.title)}
                          className="mt-2 bg-[#2196F3] text-white rounded-full px-4 py-1 text-sm hover:bg-blue-700"
                        >
                          Bid
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-[#6a7581] text-base">
              You must be a freelancer, admin, or client to view job listings.{" "}
              {user?.email ? (
                "Your account does not have permission."
              ) : (
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log in
                </Link>
              )}
            </p>
          )}
        </div>

        {/* Client's Posted Jobs */}
        {canPostJob && (
          <div className="mt-10">
            <h2 className="text-[#121416] text-xl font-semibold mb-4">
              Your Posted Jobs
            </h2>
            {clientJobs.length === 0 ? (
              <p>No jobs posted.</p>
            ) : (
              <ul>
                {clientJobs.map((job) => (
                  <li key={job.id}>{job.title}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListing;
