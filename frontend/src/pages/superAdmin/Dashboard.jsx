// import { useEffect, useState } from "react";
// import API from "../../api/axios";

// export default function SuperAdminDashboard() {
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState({});
//   const [pendingSchools, setPendingSchools] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [statsRes, pendingRes] = await Promise.all([
//           API.get('/schools/stats'),
//           API.get('/schools/pending'),
//         ]);
//         setStats(statsRes.data);
//         setPendingSchools(pendingRes.data.data);

//         console.log("schooll stats: ", statsRes?.data);
//         console.log("Pending school: ", pendingRes?.data?.data);

//         return;

//       } catch (error) {
//         setError(error.message);
//         console.log("erro from superadmin/dashboard-> fetchdata: ", error.message);

//       }
//     }
//     fetchData();
//   }, [])



//   const handleApprove = async (id) => {
//     try{
//       await API.patch(`/schools/${id}/approve`);
//       setPendingSchools((prev) => prev.filter((s) => s._id !== id));
//     }catch(error){
//       console.log("error from superadmin/dashboard -> handleapprove: ", error.message);
//     }
//   }

//   const handleReject = async (id) => {
//     try{
//       await API.delete(`/schools/${id}/reject`);
//     }catch(error){
//       console.log("error from superadmin/dashboard -> handlereject: ", error.message);
//     }
//   }
//   return (
//     <div>
//       <h1 className="font-heading text-2xl font-bold text-ink">Super Admin Dashboard</h1>
//       <p className="text-muted text-sm mt-1">Coming soon...</p>
//       <div className="flex gap-10 ">
//         <div className="text-2xl">Total schools: {stats?.data?.totalSchools}</div>
//         <div className="text-2xl">Pending request: {stats?.data?.pendingRequests}</div>
//         <div className="text-2xl">Active subscriptions: {stats?.data?.activeSubscriptions}</div>
//       </div>

//       <div className="flex gap-10 mt-10 justify-center">
//         <button className="border-2 p-3 hover:bg-amber-300 cursor-pointer bg-green-300">All Schools</button>
//         <button className="border-2 p-3  hover:bg-amber-300 cursor-pointer bg-green-300">Pending</button>
//         <button className="border-2 p-3  hover:bg-amber-300 cursor-pointer bg-green-300">Aprroved</button>
//         <button className="border-2 p-3  hover:bg-amber-300 cursor-pointer bg-green-300">Active</button>
//       </div>

//       <div>
//         <div className="flex gap-20 ">
//           <p>Name</p>
//           <p>Plan</p>
//           <p>Status</p>
//           <p>Action</p>
//         </div>
//       {pendingSchools?.map((data, index) => (
//         <div key={index} className="flex gap-10">
//         <li>
//           {data.name}
//         </li>
//         <li>
//           {data.plan}
//         </li>
//         <li>
//           {data.isApproved? "Approved": "Pending"}
//         </li>
//         <li>
//           {data.isApproved? "Approved": <div className="flex gap-3">
//             <button className="cursor-pointer" onClick={() => handleApprove(data._id)}>✅</button>
//             <button className="cursor-pointer" onClick={() => handleReject(data._id)}>❌</button>

//             </div>}
//         </li>
//         </div>

//       ))}
//       </div>

//     </div>
//   );
// }










import { useEffect, useState } from 'react';
import { School, Users, CheckCircle, Clock, Plus, Download, CheckCheck, X, MapPin } from 'lucide-react';
import API from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import IconButton from '../../components/ui/IconButton';

// School name avatar — first letter with a colored bg
function SchoolAvatar({ name }) {
  const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
  const color = colors[name?.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({});
  const [pendingSchools, setPendingSchools] = useState([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        API.get('/schools/stats'),
        API.get('/schools/pending'),
      ]);
      setStats(statsRes.data);
      setPendingSchools(pendingRes.data.data);

    } catch (error) {
      setError(error.message);
      console.log('error from superadmin/dashboard -> fetchdata: ', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/schools/${id}/approve`);
      setPendingSchools((prev) => prev.filter((s) => s._id !== id));
      await fetchData();
    } catch (error) {
      console.log('error from superadmin/dashboard -> handleApprove: ', error.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/schools/${id}/reject`);
      setPendingSchools((prev) => prev.filter((s) => s._id !== id));
      await fetchData();
    } catch (error) {
      console.log('error from superadmin/dashboard -> handleReject: ', error.message);
    }
  };

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink tracking-tight">
            System Overview
          </h1>
          <p className="text-muted text-sm mt-0.5">
            Managing the global ClassPilot infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-ink hover:bg-surface transition">
            <Download size={15} />
            Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition">
            <Plus size={15} />
            New School
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={School}
          label="Total Schools"
          value={stats?.data?.totalSchools}
          sub="Across multiple regions"
          badge="+12%"
          badgeColor="green"
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={stats?.data?.pendingRequests}
          sub="Requires verification"
          badge="Pending"
          badgeColor="amber"
        />
        <StatCard
          icon={CheckCircle}
          label="Active Subscriptions"
          value={stats?.data?.activeSubscriptions}
          sub="75% renewal rate"
          badge="+3"
          badgeColor="blue"
        />
      </div>

      {/* Incoming school requests table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">

        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base font-semibold text-ink">
            Incoming School Requests
          </h2>
          <button className="text-sm text-primary font-medium hover:underline">
            View All
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3">
                  School Name
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3">
                  Location
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3">
                  Plan
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wide px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {pendingSchools?.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted text-sm py-10">
                    No pending school requests
                  </td>
                </tr>
              )}

              {pendingSchools?.map((school) => (
                <tr key={school._id} className="hover:bg-surface/60 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <SchoolAvatar name={school.name} />
                      <div>
                        <p className="font-medium text-ink">{school.name}</p>
                        <p className="text-xs text-muted">{school.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-muted">
                      <MapPin size={13} />
                      <span>{school.address?.city || '—'}, {school.address?.province || '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={school.plan}
                      variant={school.plan === 'pro' ? 'pro' : 'basic'}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={school.isApproved ? 'Approved' : 'Pending'}
                      variant={school.isApproved ? 'approved' : 'pending'}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        icon={CheckCheck}
                        variant="success"
                        title="Approve school"
                        onClick={() => handleApprove(school._id)}
                      />
                      <IconButton
                        icon={X}
                        variant="danger"
                        title="Reject school"
                        onClick={() => handleReject(school._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}