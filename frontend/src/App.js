import React, { useEffect, useRef, useState } from 'react';
import keycloak from './keycloak';
import axios from 'axios';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [backendData, setBackendData] = useState('');
  const [error, setError] = useState('');
  const initCalled = useRef(false);

  useEffect(() => {
    if (!initCalled.current && !keycloak.authenticated) {
      initCalled.current = true;
      keycloak.init({ onLoad: 'login-required' }).then(auth => {
        setAuthenticated(auth);
        if (auth) setUser(keycloak.tokenParsed);
      });
    }
  }, []);

  const callBackend = async () => {
    setError('');
    setBackendData('');
    try {
      const res = await axios.get('http://localhost:5000/api/data', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      setBackendData(res.data.message || JSON.stringify(res.data));
    } catch (err) {
      setError(err.response?.data || err.message || 'Unknown error');
    }
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Welcome, {user?.preferred_username}</h1>
      <h3>User Profile</h3>
      <ul>
        <li><strong>Username:</strong> {user?.preferred_username}</li>
        <li><strong>Email:</strong> {user?.email}</li>
        <li><strong>First Name:</strong> {user?.given_name}</li>
        <li><strong>Last Name:</strong> {user?.family_name}</li>
        <li><strong>Roles:</strong> {(user?.realm_access?.roles || []).join(', ')}</li>
      </ul>

      <h3>Token</h3>
      <pre style={{ background: '#f4f4f4', padding: 10, maxWidth: 600, overflowX: 'auto' }}>
        {keycloak.token}
      </pre>

      <button onClick={callBackend} style={{ marginRight: 10 }}>Call Backend API</button>
      <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff' }}>Logout</button>

      {backendData && (
        <div style={{ marginTop: 20, color: 'green' }}>
          <strong>Backend says:</strong> {backendData}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>Error:</strong>{" "}
          {typeof error === "string"
            ? error
            : error && typeof error === "object"
              ? error.error
                ? `${error.error}${error.details ? ': ' + error.details : ''}`
                : JSON.stringify(error)
              : null}
        </div>
      )}

    </div>
  );
}

export default App;
