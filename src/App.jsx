
import { useState } from "react";
import AppointmentPage from "./pages/AppointmentPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EmailConfirmation from "./components/auth/EmailConfirmation";
import { setToken, getToken, removeToken } from "./services/jwt";
import { loginUser, registerUser, forgotPasswordUser, resetPasswordUser, confirmEmailUser } from "./services/api";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  const handleLogin = async ({ username, password }) => {
    const response = await loginUser({ username, password });
    setToken(response.data.token);
    setIsAuthenticated(true);
  };

  const handleRegister = async ({ username, password }) => {
    const response = await registerUser({ username, password });
    setToken(response.data.token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        {authMode === "login" && (
          <>
            <Login onLogin={handleLogin} />
            <p>
              <button onClick={() => setAuthMode("forgot")}>Forgot Password?</button>
            </p>
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode("register")}>Register</button>
            </p>
          </>
        )}
        {authMode === "register" && (
          <>
            <Register onRegister={handleRegister} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode("login")}>Login</button>
            </p>
          </>
        )}
        {authMode === "forgot" && (
          <>
            <ForgotPassword onForgot={forgotPasswordUser} />
            <p>
              <button onClick={() => setAuthMode("reset")}>Have a reset link? Reset Password</button>
            </p>
            <p>
              <button onClick={() => setAuthMode("login")}>Back to Login</button>
            </p>
          </>
        )}
        {authMode === "reset" && (
          <>
            <ResetPassword onReset={resetPasswordUser} />
            <p>
              <button onClick={() => setAuthMode("login")}>Back to Login</button>
            </p>
            <p>
              <button onClick={() => setAuthMode("confirm")}>Confirm Email</button>
            </p>
          </>
        )}
        {authMode === "confirm" && (
          <>
            <EmailConfirmation onConfirm={confirmEmailUser} />
            <p>
              <button onClick={() => setAuthMode("login")}>Back to Login</button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <header style={{ width: '100%', background: '#2563eb', color: '#fff', padding: '12px 0', marginBottom: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <button onClick={handleLogout} style={{ background: '#fff', color: '#2563eb', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginRight: 32 }}>Logout</button>
      </header>
      <AppointmentPage />
    </>
  );
}

export default App;
