import React, { useState } from 'react';

const ForgotPassword = ({ onForgot }) => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await onForgot({ username });
      setMessage('Password reset link sent if email exists.');
    } catch (err) {
      setError('Failed to send reset link.');
    }
  };

  return (
    <div className="auth-form-card">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
