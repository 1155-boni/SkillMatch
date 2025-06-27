import React, { useEffect, useState } from 'react';

function FreelancerDashboard() {
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(allJobs);
    const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const myBookings = storedBookings.filter(b => b.freelancer === user.email);
    setBookings(myBookings);
  }, []);

  const handleBookJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const newBooking = {
      jobId,
      freelancer: user.email,
      status: 'Awaiting Approval',
      bookedAt: new Date().toISOString(),
    };

    const updatedBookings = [...bookings, newBooking];
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    localStorage.setItem('bookings', JSON.stringify([...allBookings, newBooking]));
    setBookings(updatedBookings);
    alert('Job booked! Awaiting client approval.');
  };

  const handleCancelBooking = (jobId) => {
    const updatedBookings = bookings.filter(b => b.jobId !== jobId);
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      .filter(b => !(b.jobId === jobId && b.freelancer === user.email));
    localStorage.setItem('bookings', JSON.stringify(allBookings));
    setBookings(updatedBookings);
    alert('Booking canceled.');
  };

  const isBooked = (jobId) => bookings.some(b => b.jobId === jobId);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-4">Freelancer Dashboard</h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Available Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs available at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map(job => {
              const booked = isBooked(job.id);
              return (
                <li key={job.id} className="bg-[#f1f2f4] p-4 rounded-xl">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-[#6a7581]">{job.description}</p>
                  <p className="text-sm">Salary: ${job.salary}</p>
                  <p className="text-sm">Deadline: {job.deadline}</p>
                  {!booked && (
                    <button
                      onClick={() => handleBookJob(job.id)}
                      className="mt-2 bg-green-600 text-white px-4 py-1 rounded-full text-sm hover:bg-green-700"
                    >
                      Book Job
                    </button>
                  )}
                  {booked && (
                    <span className="mt-2 inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                      Booked
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">My Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map(booking => {
              const job = jobs.find(j => j.id === booking.jobId);
              if (!job) return null;
              return (
                <li key={booking.jobId} className="bg-white p-4 rounded-xl border">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p className="text-sm text-[#6a7581]">{job.description}</p>
                  <p className="text-sm">Salary: ${job.salary}</p>
                  <p className="text-sm">Status: 
                    <span className={`ml-2 font-medium ${booking.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {booking.status}
                    </span>
                  </p>
                  <button
                    onClick={() => handleCancelBooking(booking.jobId)}
                    className="mt-2 bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700"
                  >
                    Cancel Booking
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default FreelancerDashboard;
