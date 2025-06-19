import React from 'react';

function AdminDashboard() {
  return (
    <div className="w-[512px] max-w-[960px] py-5">
      <h2 className="text-[#121416] text-[28px] font-bold leading-tight px-4 text-center pb-3">Admin Dashboard</h2>
      <div className="px-4">
        <p>Manage users and jobs.</p>
        <button className="bg-[#c9daec] rounded-full px-4 py-2 text-sm mb-4">Approve Listings</button>
        <div>
          <h3 className="text-lg font-medium">Active Users</h3>
          <pre><code className="chartjs">
{
  {
    "type": "bar",
    "data": {
      "labels": ["Freelancers", "Clients", "Admins"],
      "datasets": [{
        "label": "Users",
        "data": [50, 30, 5],
        "backgroundColor": ["#4CAF50", "#2196F3", "#FF9800"]
      }]
    },
    "options": {
      "scales": {
        "y": { "beginAtZero": true }
      }
    }
  }
}
          </code></pre>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;