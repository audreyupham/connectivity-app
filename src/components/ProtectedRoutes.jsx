import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const location = useLocation();

  if (!token) {
    const redirect =
      location.pathname + location.search;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  // Terms page itself is allowed
  if (
    location.pathname !== "/terms" &&
    user &&
    !user.termsAccepted
  ) {
    return <Navigate to="/terms" replace />;
  }

  return children;
}