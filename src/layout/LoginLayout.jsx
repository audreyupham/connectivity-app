export default function LoginLayoutPage({ title = "Login", children }) {
  return (
    <div className="login-layout">
      <div className="login-card">
        <h1 className="login-title">Connectivity</h1>

        <div className="login-box">
          <h2 className="login-heading">{title}</h2>

          {children}

          <div className="login-links">
            <Link to="/forgot-password" className="login-link">
              Forgot pw
            </Link>
            <Link to="/signup" className="login-link">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}