import React, { useState } from 'react';

function JobListing() {
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAuthorized = user && ['freelancer', 'admin'].includes(user.role);
  const isFreelancer = user && user.role === 'freelancer';
  const canPostJob = user && ['freelancer', 'admin'].includes(user.role); // Restrict job posting

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Web Developer',
      description: 'Create a responsive website for a small business.',
      salary: '60',
      design: 'UI/UX',
      deadline: '2025-06-30',
      postedDate: '2025-06-18',
    },
    {
      id: 2,
      title: 'Graphic Designer',
      description: 'Design logos and marketing materials for a startup.',
      salary: '50',
      design: 'Graphic Design',
      deadline: '2025-07-15',
      postedDate: '2025-06-17',
    },
    {
      id: 3,
      title: 'Content Writer',
      description: 'Write blog posts and articles for a tech company.',
      salary: '40',
      design: 'Content Creation',
      deadline: '2025-07-01',
      postedDate: '2025-06-19',
    },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    design: '',
    deadline: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

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
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs([...jobs, newJob]);
    setFormData({ title: '', description: '', salary: '', design: '', deadline: '' });
    alert('Job posted successfully!');
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
      <h1 className="text-[#121416] text-[32px] font-bold leading-tight mb-6">Job Listings</h1>
      <p className="text-[#6a7581] text-lg leading-relaxed mb-6">
        Browse available opportunities or post a new job (freelancers and admins only).
      </p>

      {/* Job Posting Form */}
      {canPostJob ? (
        <div className="bg-[#f1f2f4] p-6 rounded-xl mb-8">
          <h2 className="text-[#121416] text-xl font-semibold mb-4">Post a Job</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="off"
              required
            />
            <textarea
              id="description"
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-24 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="off"
              required
            />
            <input
              id="salary"
              name="salary"
              type="text"
              placeholder="Salary (e.g., 50)"
              value={formData.salary}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="off"
              required
            />
            <input
              id="design"
              name="design"
              type="text"
              placeholder="Design (e.g., UI/UX)"
              value={formData.design}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
              autoComplete="off"
              required
            />
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-14 p-4 text-base font-normal leading-normal"
              required
            />
            <button
              type="submit"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Post Job</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-[#f1f2f4] p-6 rounded-xl mb-8">
          <p className="text-[#6a7581] text-base">
            Only freelancers and admins can post jobs.{' '}
            {user.email ? (
              'Your account does not have permission.'
            ) : (
              <Link to="/login" className="text-[#4CAF50] hover:underline">
                Log in
              </Link>
            )}
          </p>
        </div>
      )}

      {/* Job Listings */}
      <div>
        <h2 className="text-[#121416] text-xl font-semibold mb-4">Available Jobs</h2>
        {isAuthorized ? (
          <>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search jobs by title, description, or design..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-white focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                autoComplete="off"
              />
            </div>
            {filteredJobs.length === 0 ? (
              <p className="text-[#6a7581] text-base">No jobs found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredJobs.map((job) => (
                  <li key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl">
                    <h3 className="text-[#121416] font-semibold">{job.title}</h3>
                    <p className="text-[#6a7581] text-sm">{job.description}</p>
                    <p className="text-[#6a7581] text-sm">Salary: {job.salary}</p>
                    <p className="text-[#6a7581] text-sm">Design: {job.design}</p>
                    <p className="text-[#6a7581] text-sm">Deadline: {job.deadline}</p>
                    <p className="text-[#6a7581] text-sm">Posted: {job.postedDate}</p>
                    {isFreelancer && (
                      <button
                        onClick={() => handleBid(job.id, job.title)}
                        className="mt-2 flex min-w-[84px] max-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#4CAF50] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                      >
                        <span className="truncate">Bid</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-[#6a7581] text-base">
            You must be a freelancer or admin to view job listings.{' '}
            {user.email ? (
              'Your account does not have permission.'
            ) : (
              <Link to="/login" className="text-[#4CAF50] hover:underline">
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