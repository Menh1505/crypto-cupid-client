// LoginButton.js
import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    window.open('http://localhost:8080/auth/google', '_self');
  };

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default LoginButton;
