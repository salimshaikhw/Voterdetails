import React, { useState } from 'react';

const EmailConfirmation = ({ onConfirm }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await onConfirm({ code });
      setMessage('Email confirmed successfully.');
    } catch (err) {
      setError('Invalid or expired confirmation code.');
    }
  };

  return (
    <div className="auth-form-card">
      <h2>Email Confirmation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Confirmation Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <button type="submit">Confirm Email</button>
      </form>
    </div>
  );
};

export default EmailConfirmation;
