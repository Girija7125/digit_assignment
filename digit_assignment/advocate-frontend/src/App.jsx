import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/advocate/Login";
import Register from "./pages/advocate/Register";
import AadhaarVerification from "./pages/advocate/AadhaarVerification";
import SubmissionConfirmation from "./pages/advocate/SubmissionConfirmation";
import MyApplications from "./pages/advocate/MyApplications";
import NyayMitraLogin from "./pages/nyaymitra/NyayMitraLogin";
import PendingList from "./pages/nyaymitra/PendingList";
import ApplicationDetails from "./pages/nyaymitra/ApplicationDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/advocate/register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path="/advocate/aadhaar" element={<ProtectedRoute><AadhaarVerification /></ProtectedRoute>} />
          <Route path="/advocate/confirmation" element={<ProtectedRoute><SubmissionConfirmation /></ProtectedRoute>} />
          <Route path="/advocate/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/nyaymitra/login" element={<NyayMitraLogin />} />
          <Route path="/nyaymitra/pending" element={<ProtectedRoute role="NYAY_MITRA"><PendingList /></ProtectedRoute>} />
          <Route path="/nyaymitra/application/:id" element={<ProtectedRoute role="NYAY_MITRA"><ApplicationDetails /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
