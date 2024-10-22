import React from 'react';
import { Link } from 'react-router-dom';

function ProfileButton() {
  return (
    <Link to="/profile">
      <button className="profile-button">
        Profile
      </button>
    </Link>
  );
}

export default ProfileButton;
