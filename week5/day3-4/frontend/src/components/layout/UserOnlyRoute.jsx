import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

export default function UserOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin or superadmin, redirect to admin dashboard
  if (user.role === 'admin' || user.role === 'superadmin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}