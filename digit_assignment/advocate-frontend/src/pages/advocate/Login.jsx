import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [userType, setUserType] = useState("ADVOCATE");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setError("Mobile number must contain only digits");
      return;
    }
    login(
      {
        mobileNumber,
        userType,
        role: "ADVOCATE",
        uuid: "user-" + Date.now(),
        name: "Advocate User",
      },
      "mock-auth-token-" + Date.now()
    );
    navigate("/advocate/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Advocate Portal</h2>
          <p className="text-gray-500 text-sm mt-1">Register or login to continue</p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ADVOCATE">Advocate</option>
              <option value="ADVOCATE_CLERK">Advocate Clerk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => { setMobileNumber(e.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="Enter 10-digit mobile number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            Register / Login
          </button>
          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-gray-500 text-sm">Court staff? </span>
            <a href="/nyaymitra/login" className="text-blue-600 text-sm font-medium hover:underline">Nyay Mitra Login</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
