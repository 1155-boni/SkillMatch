import React, { useEffect, useState } from "react";
import Messaging from "./Messaging"; // this must be created separately
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

function FreelancerDashboard() {
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [message, setMessage] = useState(""); // <-- Add this line
  const [clientProfiles, setClientProfiles] = useState({});
  const [freelancerProfiles, setFreelancerProfiles] = useState({});

  useEffect(() => {
    // Listen for all jobs
    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobList = [];
      snapshot.forEach((doc) => jobList.push({ ...doc.data(), id: doc.id }));
      setJobs(jobList);
    });

    // Listen for bookings for this freelancer
    const bookingsQuery = query(
      collection(db, "bookings"),
      where("freelancer", "==", user.email)
    );
    const unsubBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingList = [];
      snapshot.forEach((doc) =>
        bookingList.push({ ...doc.data(), id: doc.id })
      );
      setBookings(bookingList);
    });

    return () => {
      unsubJobs();
      unsubBookings();
    };
  }, [user.email]);

  // After jobs are loaded, fetch client profiles
  useEffect(() => {
    const fetchClients = async () => {
      const emails = [...new Set(jobs.map((job) => job.postedBy))];
      const profiles = {};
      for (const email of emails) {
        if (!email) continue;
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          profiles[email] = docSnap.data();
        }
      }
      setClientProfiles(profiles);
    };
    if (jobs.length > 0) fetchClients();
  }, [jobs]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      const emails = [...new Set(bookings.map((b) => b.freelancer))];
      const profiles = {};
      for (const email of emails) {
        if (!email) continue;
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          profiles[email] = docSnap.data();
        }
      }
      setFreelancerProfiles(profiles);
    };
    if (bookings.length > 0) fetchFreelancers();
  }, [bookings]);

  const handleBookJob = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    // Prevent double booking
    if (bookings.some((b) => b.jobId === jobId)) {
      setMessage("You have already booked this job.");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      jobId,
      freelancer: user.email,
      status: "Awaiting Approval",
      bookedAt: new Date().toISOString(),
    });
    setMessage("Job booked! Awaiting client approval.");
  };

  const handleCancelBooking = async (jobId) => {
    // Find the booking document
    const q = query(
      collection(db, "bookings"),
      where("jobId", "==", jobId),
      where("freelancer", "==", user.email)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "bookings", docSnap.id));
    });
    setMessage("Booking canceled.");
  };

  const isBooked = (jobId) => bookings.some((b) => b.jobId === jobId);
  const currentUser = user; // Add this line
  const isOwnProfile = true; // <-- Add this line

  return (
    <div className="bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100">
      <div className="w-full max-w-4xl mx-auto py-6 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Freelancer Dashboard
        </h2>

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

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-full ${
              activeTab === "dashboard" ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-r-full ${
              activeTab === "messages" ? "bg-blue-200" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
        </div>

        {/* Tabs */}
        {activeTab === "dashboard" && (
          <>
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Available Jobs</h3>
              {jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
              ) : (
                <ul className="space-y-4">
                  {jobs.map((job) => {
                    const booked = isBooked(job.id);
                    return (
                      <li key={job.id} className="bg-gray-100 p-4 rounded-xl">
                        {/* Client Info */}
                        {clientProfiles[job.postedBy] && (
                          <div className="flex items-center gap-2 mb-2">
                            <a href={`/profile/${job.postedBy}`}>
                              <img
                                src={
                                  clientProfiles[job.postedBy].profileImage ||
                                  "https://via.placeholder.com/40?text=User"
                                }
                                alt={
                                  clientProfiles[job.postedBy].username ||
                                  job.postedBy
                                }
                                className="w-8 h-8 rounded-full object-cover border"
                                title="View Profile"
                              />
                            </a>
                            <span className="font-medium text-sm">
                              {
                                clientProfiles[job.postedBy].username ||
                                job.postedBy
                              }
                            </span>
                          </div>
                        )}
                        <h4 className="font-semibold">{job.title}</h4>
                        <p className="text-sm text-gray-600">
                          {job.description}
                        </p>
                        <p className="text-sm">Salary: ${job.salary}</p>
                        <p className="text-sm">Deadline: {job.deadline}</p>
                        {!booked ? (
                          <button
                            onClick={() => handleBookJob(job.id)}
                            className="mt-2 bg-green-600 text-white px-4 py-1 rounded-full text-sm hover:bg-green-700"
                          >
                            Book Job
                          </button>
                        ) : (
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
                  {bookings.map((booking) => (
                    <li
                      key={booking.id}
                      className="bg-white p-4 rounded-xl border flex items-center gap-3"
                    >
                      {/* Freelancer Info */}
                      {freelancerProfiles[booking.freelancer] && (
                        <a href={`/profile/${booking.freelancer}`}>
                          <img
                            src={
                              freelancerProfiles[booking.freelancer]
                                .profileImage || "https://via.placeholder.com/40?text=User"
                            }
                            alt={
                              freelancerProfiles[booking.freelancer].username ||
                              booking.freelancer
                            }
                            className="w-8 h-8 rounded-full object-cover border"
                            title="View Profile"
                          />
                        </a>
                      )}
                      <span className="font-medium text-sm">
                        {
                          freelancerProfiles[booking.freelancer]?.username ||
                          booking.freelancer
                        }
                      </span>
                      <h4 className="font-semibold">{booking.title}</h4>
                      <p className="text-sm text-gray-600">
                        {booking.description}
                      </p>
                      <p className="text-sm">Salary: ${booking.salary}</p>
                      <p className="text-sm">
                        Status:
                        <span
                          className={`ml-2 font-medium ${
                            booking.status === "Approved"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
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
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {activeTab === "messages" && <Messaging user={user} />}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
