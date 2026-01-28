import React, { useState } from 'react';

const ResetPassword = ({ onReset }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await onReset({ password });
      setMessage('Password has been reset.');
    } catch (err) {
      setError('Failed to reset password.');
    }
  };

  return (
    <div className="auth-form-card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
