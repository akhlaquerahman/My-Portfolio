import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './pages/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Navbar from './pages/Navbar';
import Profile from './pages/Profile';
import ResumeViewerPage from './pages/ResumeViewerPage';
import { AuthProvider } from './pages/context/AuthContext';
import ProtectedRoute from './pages/context/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resume" element={<ResumeViewerPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;
