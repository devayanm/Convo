import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Meetings from './components/Meetings';
import Messages from './components/Messages';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';
import Homepage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meetings" element={<PrivateRoute><Meetings /></PrivateRoute>} />
        <Route path="/meeting/:id/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/user/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
