import { useNavigate } from "react-router-dom";

const SubmissionConfirmation = () => {
  const navigate = useNavigate();
  const appNumber = localStorage.getItem("applicationNumber") || "ADVOC-001-2024";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 text-sm mb-6">Your registration request has been submitted and is pending verification by Nyay Mitra.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-1">Application Number</p>
          <p className="text-2xl font-bold text-blue-700">{appNumber}</p>
          <p className="text-xs text-blue-400 mt-2">Save this number for your reference</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-3">
          <p className="text-sm font-semibold text-gray-700">What happens next?</p>
          <div className="space-y-2">
            {["Nyay Mitra will verify your BAR Council ID", "You will receive an SMS on approval or rejection", "On approval you can log in and file cases"].map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-blue-500 font-medium text-sm mt-0.5">{i + 1}.</span>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={() => navigate("/advocate/applications")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">View My Applications</button>
          <button onClick={() => navigate("/")} className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm">Go to Home</button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;
