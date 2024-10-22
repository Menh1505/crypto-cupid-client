import React from 'react';
import { Link } from 'react-router-dom';

function ProfileButton() {
  return (
    <Link to="/chat">
      <button className="profile-button">
        Chat
      </button>
    </Link>
  );
}

export default ProfileButton;
