import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './pages/context/ProtectedRoute'; // Import ProtectedRoute
import { AuthProvider } from './pages/context/AuthContext'; // Path corrected to '../context/AuthContext'

const App = () => {
  return (
    <Router>
      <AuthProvider> 
        <Navbar />
        <main>
          <Routes>
            <Route path='/' element={<HomePage />} exact />
            
            {/* 💡 NEW: Protected Route Group */}
            <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<Profile/>}/>
            </Route>
            
            <Route path='/login' element={<LoginPage/>}/> 
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
};

export default App;