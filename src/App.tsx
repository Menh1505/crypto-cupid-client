import React, { useEffect } from 'react';
import axios from 'axios';
import { useUser } from './context/UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Profile from './pages/profile';
import SwipePage from './pages/swipe';
import ChatPage from './pages/chat';

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    // Fetch user session
    axios.get('http://localhost:8080/auth/check', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      });
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/swipe' element={<SwipePage/>}/>
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
