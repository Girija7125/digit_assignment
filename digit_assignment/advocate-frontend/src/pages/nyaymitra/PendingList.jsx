import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAdvocates } from "../../services/api";

const mockData = [
  { id: "1", applicationNumber: "ADVOC-001-2024", userType: "ADVOCATE", mobileNumber: "9876543210", status: "PENDINGVERIFICATION", barRegistrationNumber: "BAR123456", auditDetails: { createdTime: Date.now() - 86400000 * 5 } },
  { id: "2", applicationNumber: "ADVOC-CLERK-001-2024", userType: "ADVOCATE_CLERK", mobileNumber: "9123456789", status: "PENDINGVERIFICATION", auditDetails: { createdTime: Date.now() - 86400000 * 2 } },
  { id: "3", applicationNumber: "ADVOC-002-2024", userType: "ADVOCATE", mobileNumber: "9000011111", status: "PENDINGVERIFICATION", barRegistrationNumber: "BAR789012", auditDetails: { createdTime: Date.now() - 86400000 * 7 } },
];

const PendingList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    searchAdvocates({ tenantId: "pg", status: "PENDINGVERIFICATION" })
      .then((data) => { const list = data?.advocates || []; setApplications(list.length > 0 ? list : mockData); })
      .catch(() => setApplications(mockData))
      .finally(() => setLoading(false));
  }, []);

  const getDueSince = (createdTime) => {
    const days = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const filtered = applications
    .filter((a) => { const q = search.toLowerCase(); return a.applicationNumber?.toLowerCase().includes(q) || a.mobileNumber?.includes(q) || a.userType?.toLowerCase().includes(q); })
    .sort((a, b) => (a.auditDetails?.createdTime || 0) - (b.auditDetails?.createdTime || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pending Registrations</h1>
            <p className="text-gray-500 text-sm mt-1">{filtered.length} application{filtered.length !== 1 ? "s" : ""} pending review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by application number, mobile number or user type..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div><p className="text-gray-400 text-sm">Loading...</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16"><p className="text-gray-400 font-medium">No pending applications found</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Application ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Created</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Since</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((app, idx) => (
                    <tr key={app.id} className={`hover:bg-orange-50 transition-colors ${idx === 0 ? "bg-red-50" : "bg-white"}`}>
                      <td className="px-5 py-4 font-semibold text-blue-600">{app.applicationNumber}</td>
                      <td className="px-5 py-4 text-gray-600">{app.mobileNumber}</td>
                      <td className="px-5 py-4"><span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">{app.userType === "ADVOCATE" ? "Advocate" : "Advocate Clerk"}</span></td>
                      <td className="px-5 py-4 text-gray-500">{app.auditDetails?.createdTime ? new Date(app.auditDetails.createdTime).toLocaleDateString("en-IN") : "N/A"}</td>
                      <td className="px-5 py-4"><span className={`text-xs font-semibold ${idx === 0 ? "text-red-600" : "text-gray-500"}`}>{getDueSince(app.auditDetails?.createdTime || 0)}</span></td>
                      <td className="px-5 py-4"><button onClick={() => navigate(`/nyaymitra/application/${app.id}`, { state: { application: app } })} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors">Review request</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingList;
