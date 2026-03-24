import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdvocate } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AadhaarVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formData = (() => {
    try { return JSON.parse(localStorage.getItem("registrationForm") || "{}"); }
    catch { return {}; }
  })();

  const handleSendOtp = () => {
    if (aadhaar.length !== 12) { setError("Please enter a valid 12-digit Aadhaar number"); return; }
    setError("");
    setOtpSent(true);
  };

  const submitApplication = async () => {
    setLoading(true);
    try {
      const advocateData = {
        tenantId: "pg",
        userType: user?.userType || "ADVOCATE",
        mobileNumber: user?.mobileNumber,
        barRegistrationNumber: formData.barRegistrationNumber || "",
        advocateId: formData.advocateId || "",
        isActive: true,
        documents: formData.documentType ? [{ documentType: formData.documentType, fileStoreId: "mock-file-store-id", isActive: true }] : [],
        workflow: { action: "APPLY", comments: "Applying for advocate registration" },
      };
      const response = await createAdvocate(advocateData);
      const appNumber = response?.advocates?.[0]?.applicationNumber || "ADVOC-" + String(Math.floor(Math.random() * 999) + 1).padStart(3, "0") + "-" + new Date().getFullYear();
      localStorage.setItem("applicationNumber", appNumber);
      navigate("/advocate/confirmation");
    } catch {
      const fallback = "ADVOC-" + String(Math.floor(Math.random() * 999) + 1).padStart(3, "0") + "-" + new Date().getFullYear();
      localStorage.setItem("applicationNumber", fallback);
      navigate("/advocate/confirmation");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (otp.length !== 6) { setError("Please enter the 6-digit OTP"); return; }
    setError("");
    submitApplication();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
          <span className="text-yellow-500 text-sm mt-0.5">⚠</span>
          <p className="text-yellow-700 text-xs leading-relaxed">Aadhaar verification is a dummy screen. No real UIDAI integration. Use any 12-digit number and OTP 123456.</p>
        </div>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Aadhaar Verification</h2>
          <p className="text-gray-500 text-sm mt-1">Verify your identity to complete registration</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input type="text" maxLength={12} value={aadhaar} onChange={(e) => { setAadhaar(e.target.value.replace(/\D/g, "")); setError(""); }} placeholder="Enter 12-digit Aadhaar number" disabled={otpSent} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400" />
          </div>
          {!otpSent ? (
            <button onClick={handleSendOtp} disabled={aadhaar.length !== 12} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm">Send OTP</button>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <p className="text-green-700 text-xs">OTP sent to your registered mobile (dummy — use 123456)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                <input type="text" maxLength={6} value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }} placeholder="Enter 6-digit OTP" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={handleVerify} disabled={otp.length !== 6 || loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm">{loading ? "Submitting application..." : "Verify & Submit"}</button>
            </>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="text-center pt-2">
            <button onClick={submitApplication} disabled={loading} className="text-gray-400 text-sm hover:text-gray-600 underline disabled:cursor-not-allowed">Skip — upload ID instead</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarVerification;
