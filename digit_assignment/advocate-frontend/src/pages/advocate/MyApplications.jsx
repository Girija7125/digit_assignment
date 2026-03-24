import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAdvocates } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const statusConfig = {
  PENDINGVERIFICATION: { label: "Pending Verification", className: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Approved", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700" },
};

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchAdvocates({ mobileNumber: user?.mobileNumber, tenantId: "pg" })
      .then((data) => {
        const list = data?.advocates || [];
        if (list.length > 0) {
          setApplications(list);
        } else {
          const appNumber = localStorage.getItem("applicationNumber");
          if (appNumber) setApplications([{ id: "1", applicationNumber: appNumber, userType: user?.userType || "ADVOCATE", status: "PENDINGVERIFICATION", mobileNumber: user?.mobileNumber, auditDetails: { createdTime: Date.now() } }]);
        }
      })
      .catch(() => {
        const appNumber = localStorage.getItem("applicationNumber");
        setApplications(appNumber ? [{ id: "1", applicationNumber: appNumber, userType: user?.userType || "ADVOCATE", status: "PENDINGVERIFICATION", mobileNumber: user?.mobileNumber, auditDetails: { createdTime: Date.now() } }] : []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>
          <button onClick={() => navigate("/advocate/register")} className="text-sm text-blue-600 hover:underline">New Application</button>
        </div>
        {loading ? (
          <div className="text-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div><p className="text-gray-400 text-sm">Loading applications...</p></div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <p className="text-gray-500 font-medium">No applications found</p>
            <button onClick={() => navigate("/advocate/register")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition-colors">Register Now</button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const status = statusConfig[app.status] || { label: app.status, className: "bg-gray-100 text-gray-600" };
              return (
                <div key={app.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Application Number</p>
                      <p className="text-lg font-bold text-blue-600">{app.applicationNumber}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-xs text-gray-400">User Type</p><p className="font-medium text-gray-700">{app.userType === "ADVOCATE" ? "Advocate" : "Advocate Clerk"}</p></div>
                    <div><p className="text-xs text-gray-400">Submitted On</p><p className="font-medium text-gray-700">{app.auditDetails?.createdTime ? new Date(app.auditDetails.createdTime).toLocaleDateString("en-IN") : "N/A"}</p></div>
                  </div>
                  {app.status === "REJECTED" && <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3"><p className="text-red-600 text-sm font-medium">Application Rejected</p><p className="text-red-500 text-xs mt-1">Check your SMS for the rejection reason</p></div>}
                  {app.status === "APPROVED" && <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3"><p className="text-green-600 text-sm font-medium">Registration Approved</p><p className="text-green-500 text-xs mt-1">You can now access all court portal features</p></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
