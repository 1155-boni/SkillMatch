import React, { useState } from "react";
import { Link } from "react-router-dom";

function JobListing() {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAuthorized =
    user && ["freelancer", "admin", "client"].includes(user.role);
  const isFreelancer = user && user.role === "freelancer";
  const canPostJob = user && user.role === "client"; // ✅ Only clients can post jobs

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Web Developer",
      description: "Create a responsive website for a small business.",
      salary: "60",
      design: "UI/UX",
      deadline: "2025-06-30",
      postedDate: "2025-06-18",
    },
    // Add more default jobs if needed
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    design: "",
    deadline: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newJob = {
      id: Date.now(),
      ...formData,
      postedDate: new Date().toISOString().split("T")[0],
    };
    setJobs([...jobs, newJob]);
    setFormData({
      title: "",
      description: "",
      salary: "",
      design: "",
      deadline: "",
    });
    alert("Job posted successfully!");
  };

  const handleBid = (jobId, jobTitle) => {
    alert(`Bid placed on job: ${jobTitle} (ID: ${jobId})`);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.design.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
    </div>
  );
}

export default JobListing;
