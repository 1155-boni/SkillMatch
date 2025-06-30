import React, { useState, useEffect } from 'react';
import Messaging from './Messaging';
import { db } from '../firebase';
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
  setDoc
} from 'firebase/firestore';

function ClientDashboard() {
  const user = JSON.parse(localStorage.getItem('userData'));
  const clientEmail = user?.email || '';

  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobData, setJobData] = useState({
    title: '', description: '', salary: '', category: 'Design', deadline: '',
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState(''); // <-- Add message state

  useEffect(() => {
    // Listen for jobs posted by this client
    const jobsQuery = query(collection(db, 'jobs'), where('postedBy', '==', clientEmail));
    const unsubJobs = onSnapshot(jobsQuery, (snapshot) => {
      const jobList = [];
      snapshot.forEach(doc => jobList.push({ ...doc.data(), id: doc.id }));
      setJobs(jobList);
    });

    // Listen for all bookings
    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookingList = [];
      snapshot.forEach(doc => bookingList.push({ ...doc.data(), id: doc.id }));
      setBookings(bookingList);
    });

    return () => {
      unsubJobs();
      unsubBookings();
    };
  }, [clientEmail]);

  const updateJob = (j) => {
    setJobData(j);
    setEditingJobId(j.id);
  };

  const refreshJobs = () => {
    const allJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    setJobs(allJobs.filter(j => j.postedBy === clientEmail));
  };

  const refreshBookings = () => {
    setBookings(JSON.parse(localStorage.getItem('bookings') || '[]'));
  };

  const handlePostUpdateDelete = async (e, mode) => {
    e.preventDefault();
    if (mode === 'post') {
      await addDoc(collection(db, 'jobs'), { ...jobData, postedBy: clientEmail });
      setMessage('Job posted successfully!');
    } else {
      await updateDoc(doc(db, 'jobs', editingJobId), { ...jobData, postedBy: clientEmail });
      setMessage('Job updated successfully!');
    }
    setJobData({ title: '', description: '', salary: '', category: 'Design', deadline: '' });
    setEditingJobId(null);
  };

  const handleDeleteJob = async (jobId) => {
    await deleteDoc(doc(db, 'jobs', jobId));
    setMessage('Job deleted.');
  };

  const bookingAction = async (jobId, freelancer, action) => {
    // Find the booking document
    const q = query(
      collection(db, 'bookings'),
      where('jobId', '==', jobId),
      where('freelancer', '==', freelancer)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      if (action === 'approve') {
        await updateDoc(doc(db, 'bookings', docSnap.id), { status: 'Approved' });
        setMessage('Booking approved.');
      } else {
        await deleteDoc(doc(db, 'bookings', docSnap.id));
        setMessage('Booking rejected.');
      }
    });
  };

  const awaiting = bookings.filter(b =>
    jobs.some(j => j.id === b.jobId) && b.status === 'Awaiting Approval'
  );

  const approved = bookings.filter(b =>
    jobs.some(j => j.id === b.jobId) && b.status === 'Approved'
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Client Dashboard</h2>
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
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-full ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2 rounded-full ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Messages
        </button>
      </div>

      {activeTab === 'messages'
        ? <Messaging user={user} />
        : (
          <>
            <form onSubmit={(e) => handlePostUpdateDelete(e, editingJobId ? 'update' : 'post')} className="bg-gray-100 p-4 rounded mb-8 space-y-3">
              <input name="title" placeholder="Job title" value={jobData.title} onChange={e => setJobData({ ...jobData, [e.target.name]: e.target.value })} className="w-full p-2 rounded bg-white" required />
              <textarea name="description" placeholder="Job description" value={jobData.description} onChange={e => setJobData({ ...jobData, [e.target.name]: e.target.value })} className="w-full p-2 rounded bg-white" />
              <div className="grid grid-cols-2 gap-3">
                <input name="salary" placeholder="Salary" type="number" value={jobData.salary} onChange={e => setJobData({ ...jobData, [e.target.name]: e.target.value })} className="p-2 rounded bg-white" />
                <select name="category" value={jobData.category} onChange={e => setJobData({ ...jobData, [e.target.name]: e.target.value })} className="p-2 rounded bg-white">
                  <option>Design</option><option>Development</option><option>Writing</option>
                </select>
              </div>
              <input name="deadline" type="date" value={jobData.deadline} onChange={e => setJobData({ ...jobData, [e.target.name]: e.target.value })} className="p-2 rounded bg-white" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">
                {editingJobId ? 'Update Job' : 'Post Job'}
              </button>
            </form>

            <section className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Posted Jobs</h3>
                {jobs.length === 0 ? <p>No jobs posted.</p> :
                  <ul className="space-y-3">
                    {jobs.map(j => (
                      <li key={j.id} className="bg-gray-100 p-4 rounded flex justify-between items-start">
                        <div>
                          <strong>{j.title}</strong> — ${j.salary} — {j.category} — {j.deadline || 'No deadline'}
                          <p>{j.description}</p>
                        </div>
                        <div className="space-y-1">
                          <button onClick={() => updateJob(j)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                          <button onClick={() => handleDeleteJob(j.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                }
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Awaiting Approval</h3>
                {awaiting.length === 0 ? <p>No awaiting bookings.</p> :
                  <ul className="space-y-3">
                    {awaiting.map((b,i) => {
                      const job = jobs.find(j => j.id === b.jobId);
                      return (
                        <li key={i} className="bg-yellow-100 p-4 rounded flex justify-between items-center">
                          <span><strong>{job.title}</strong> booked by {b.freelancer}</span>
                          <div className="space-x-2">
                            <button onClick={() => bookingAction(b.jobId, b.freelancer, 'approve')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                            <button onClick={() => bookingAction(b.jobId, b.freelancer, 'reject')} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                }
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Approved Bookings</h3>
                {approved.length === 0 ? <p>No approved bookings.</p> :
                  <ul className="space-y-3">
                    {approved.map((b,i) => {
                      const job = jobs.find(j => j.id === b.jobId);
                      return <li key={i} className="bg-green-100 p-4 rounded"><strong>{job.title}</strong> — Approved for {b.freelancer}</li>;
                    })}
                  </ul>
                }
              </div>
            </section>
          </>
        )}
    </div>
  );
}

export default ClientDashboard;
