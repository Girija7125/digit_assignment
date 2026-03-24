import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAdvocate } from "../../services/api";

const ApplicationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const app = state?.application || {};
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionDone, setActionDone] = useState(null);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await updateAdvocate({ id: app.id, tenantId: "pg", workflow: { action: "APPROVE", comments: "Registration verified and approved by Nyay Mitra" } });
    } catch {}
    setActionDone("APPROVED");
    setLoading(false);
    setTimeout(() => navigate("/nyaymitra/pending"), 2000);
  };

  const handleReject = async () => {
    if (!remarks.trim()) return;
    setLoading(true);
    try {
      await updateAdvocate({ id: app.id, tenantId: "pg", workflow: { action: "REJECT", comments: remarks } });
    } catch {}
    setShowRejectModal(false);
    setActionDone("REJECTED");
    setLoading(false);
    setTimeout(() => navigate("/nyaymitra/pending"), 2000);
  };

  if (actionDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-sm w-full">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${actionDone === "APPROVED" ? "bg-green-100" : "bg-red-100"}`}>
            {actionDone === "APPROVED" ? (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Application {actionDone === "APPROVED" ? "Approved" : "Rejected"}</h3>
          <p className="text-gray-500 text-sm">SMS notification sent to applicant. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to pending list
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Application Number</p>
              <p className="text-xl font-bold text-blue-600">{app.applicationNumber || "N/A"}</p>
            </div>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">Pending Verification</span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div><p className="text-xs text-gray-400 mb-1">User Type</p><p className="text-sm font-semibold text-gray-700">{app.userType === "ADVOCATE" ? "Advocate" : "Advocate Clerk"}</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Mobile Number</p><p className="text-sm font-semibold text-gray-700">{app.mobileNumber || "N/A"}</p></div>
            <div><p className="text-xs text-gray-400 mb-1">Submitted On</p><p className="text-sm font-semibold text-gray-700">{app.auditDetails?.createdTime ? new Date(app.auditDetails.createdTime).toLocaleDateString("en-IN") : "N/A"}</p></div>
            {app.barRegistrationNumber && <div><p className="text-xs text-gray-400 mb-1">BAR Registration Number</p><p className="text-sm font-semibold text-gray-700">{app.barRegistrationNumber}</p></div>}
            {app.advocateId && <div><p className="text-xs text-gray-400 mb-1">Advocate ID</p><p className="text-sm font-semibold text-gray-700">{app.advocateId}</p></div>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">Application Timeline</h3>
          <div className="relative">
            <div className="absolute left-3.5 top-4 bottom-0 w-0.5 bg-gray-100"></div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 z-10"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
                <div><p className="text-sm font-semibold text-gray-700">Application Submitted</p><p className="text-xs text-gray-400 mt-0.5">{app.auditDetails?.createdTime ? new Date(app.auditDetails.createdTime).toLocaleString("en-IN") : "N/A"}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 z-10"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
                <div><p className="text-sm font-semibold text-gray-700">Pending Verification</p><p className="text-xs text-gray-400 mt-0.5">Awaiting Nyay Mitra review</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowRejectModal(true)} disabled={loading} className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50">Reject Application</button>
          <button onClick={handleApprove} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors text-sm disabled:opacity-50">{loading ? "Processing..." : "Approve Application"}</button>
        </div>
      </div>

      {showRejectModal && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, minHeight: "100vh", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 50 }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Reject Application</h3>
              <button onClick={() => { setShowRejectModal(false); setRemarks(""); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for rejection. This will be sent to the applicant via SMS notification.</p>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
              <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={4} placeholder="Enter the reason for rejection..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              {!remarks.trim() && <p className="text-xs text-gray-400 mt-1">Reason is mandatory to confirm rejection</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowRejectModal(false); setRemarks(""); }} className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm">Cancel</button>
              <button onClick={handleReject} disabled={!remarks.trim() || loading} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm">{loading ? "Rejecting..." : "Confirm Rejection"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
