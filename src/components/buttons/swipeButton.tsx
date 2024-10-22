import React from 'react';
import { Link } from 'react-router-dom';

function ProfileButton() {
  return (
    <Link to="/swipe">
      <button className="profile-button">
        Swipe
      </button>
    </Link>
  );
}

export default ProfileButton;
