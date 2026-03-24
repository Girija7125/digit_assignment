import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchMasterData } from "../../services/api";

const steps = ["Personal details", "Document upload", "Review"];

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [form, setForm] = useState({
    mobileNumber: user?.mobileNumber || "",
    userType: user?.userType || "ADVOCATE",
    barRegistrationNumber: "",
    advocateId: "",
    documentType: "",
    documentFile: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMasterData("Advocate", "DocumentType")
      .then((data) => {
        const types = data?.MdmsRes?.Advocate?.DocumentType || data?.mdms?.Advocate?.DocumentType || [];
        setDocumentTypes(types.length > 0 ? types.filter((t) => t.isActive !== false) : [
          { code: "BAR_COUNCIL_ID", name: "Bar Council ID" },
          { code: "ID_PROOF", name: "ID Proof" },
          { code: "ADDRESS_PROOF", name: "Address Proof" },
        ]);
      })
      .catch(() => setDocumentTypes([
        { code: "BAR_COUNCIL_ID", name: "Bar Council ID" },
        { code: "ID_PROOF", name: "ID Proof" },
        { code: "ADDRESS_PROOF", name: "Address Proof" },
      ]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStep0 = () => {
    const newErrors = {};
    if (form.userType === "ADVOCATE" && !form.barRegistrationNumber.trim())
      newErrors.barRegistrationNumber = "BAR registration number is required";
    if (form.userType === "ADVOCATE_CLERK" && !form.advocateId.trim())
      newErrors.advocateId = "Advocate ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.documentType) newErrors.documentType = "Please select a document type";
    if (!form.documentFile) newErrors.documentFile = "Please upload a document";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && validateStep0()) setStep(1);
    else if (step === 1 && validateStep1()) setStep(2);
  };

  const handleProceed = () => {
    localStorage.setItem("barRegNumber", form.barRegistrationNumber);
    localStorage.setItem("registrationForm", JSON.stringify(form));
    navigate("/advocate/aadhaar");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-2">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${step > i ? "bg-green-500 text-white" : step === i ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span className={`text-xs hidden sm:block font-medium ${step === i ? "text-blue-600" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > i ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {form.userType === "ADVOCATE" ? "Advocate Registration" : "Advocate Clerk Registration"}
          </h2>

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="text" value={form.mobileNumber} disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                <input type="text" value={form.userType === "ADVOCATE" ? "Advocate" : "Advocate Clerk"} disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500" />
              </div>
              {form.userType === "ADVOCATE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BAR Registration Number <span className="text-red-500">*</span></label>
                  <input type="text" name="barRegistrationNumber" value={form.barRegistrationNumber} onChange={handleChange} placeholder="Enter BAR council registration number" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.barRegistrationNumber ? "border-red-400 bg-red-50" : "border-gray-300"}`} />
                  {errors.barRegistrationNumber && <p className="text-red-500 text-xs mt-1">{errors.barRegistrationNumber}</p>}
                </div>
              )}
              {form.userType === "ADVOCATE_CLERK" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advocate ID <span className="text-red-500">*</span></label>
                  <input type="text" name="advocateId" value={form.advocateId} onChange={handleChange} placeholder="Enter the advocate ID you work for" className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.advocateId ? "border-red-400 bg-red-50" : "border-gray-300"}`} />
                  {errors.advocateId && <p className="text-red-500 text-xs mt-1">{errors.advocateId}</p>}
                </div>
              )}
              <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">Next</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type <span className="text-red-500">*</span></label>
                <select name="documentType" value={form.documentType} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${errors.documentType ? "border-red-400" : "border-gray-300"}`}>
                  <option value="">Select document type</option>
                  {documentTypes.map((dt) => <option key={dt.code} value={dt.code}>{dt.name}</option>)}
                </select>
                {errors.documentType && <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document <span className="text-red-500">*</span></label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${errors.documentFile ? "border-red-400 bg-red-50" : form.documentFile ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { setForm({ ...form, documentFile: e.target.files[0] }); setErrors({ ...errors, documentFile: "" }); }} className="hidden" id="doc-upload" />
                  <label htmlFor="doc-upload" className="cursor-pointer block">
                    {form.documentFile ? (
                      <div><div className="text-green-600 text-2xl mb-2">✓</div><p className="font-medium text-green-700 text-sm">{form.documentFile.name}</p><p className="text-xs text-gray-400 mt-1">Click to change</p></div>
                    ) : (
                      <div><svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg><p className="text-sm text-gray-600 font-medium">Click to upload</p><p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG — max 5MB</p></div>
                    )}
                  </label>
                </div>
                {errors.documentFile && <p className="text-red-500 text-xs mt-1">{errors.documentFile}</p>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm">Back</button>
                <button onClick={handleNext} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">Next</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-700 mb-3">Review your details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Mobile Number</p><p className="font-medium text-gray-700">{form.mobileNumber}</p></div>
                  <div><p className="text-xs text-gray-400">User Type</p><p className="font-medium text-gray-700">{form.userType === "ADVOCATE" ? "Advocate" : "Advocate Clerk"}</p></div>
                  {form.barRegistrationNumber && <div><p className="text-xs text-gray-400">BAR Number</p><p className="font-medium text-gray-700">{form.barRegistrationNumber}</p></div>}
                  {form.advocateId && <div><p className="text-xs text-gray-400">Advocate ID</p><p className="font-medium text-gray-700">{form.advocateId}</p></div>}
                  <div><p className="text-xs text-gray-400">Document Type</p><p className="font-medium text-gray-700">{form.documentType}</p></div>
                  <div><p className="text-xs text-gray-400">Document File</p><p className="font-medium text-gray-700 truncate">{form.documentFile?.name}</p></div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm">Back</button>
                <button onClick={handleProceed} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">Proceed to Verification</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
