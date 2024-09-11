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
import Footer from './components/Footer';
import MeetingDetails from './components/MeetingDetails';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meetings" element={<PrivateRoute element={Meetings} />} />
        <Route path="/meeting/:id" element={MeetingDetails} /> 
        <Route path="/meeting/:id/messages" element={<PrivateRoute element={Messages} />} />
        <Route path="/user/:id" element={<PrivateRoute element={UserProfile} />} />
        <Route path="/meeting" element={<Meetings />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
