import React from 'react';
import '../styles/navbar.css';
import LoginButton from './buttons/loginButton';
import ProfileButton from './buttons/profileButton';
import { useUser } from '../context/UserContext';
import SwipeButton from './buttons/swipeButton';
import ChatButton from './buttons/chatButton';

function Navbar() {
  const { user } = useUser();
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={require('../assets/logo.png')} alt="App Logo" />
      </div>
      <div className="navbar-title">
        Dating App
      </div>
      <div className='navbar-chat'>
        <ChatButton/>
      </div>
      <div className='navbar-swipe'>
        <SwipeButton/>
      </div>
      <div className="navbar-login">
        {user ? <ProfileButton /> : <LoginButton />}
      </div>
    </nav>
  );
}

export default Navbar;