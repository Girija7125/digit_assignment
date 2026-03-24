import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-700 font-bold text-xs">D</span>
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">Court Management System</h1>
          <p className="text-xs text-blue-200">Powered by DIGIT</p>
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.name || user.mobileNumber}</p>
            <p className="text-xs text-blue-200">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
