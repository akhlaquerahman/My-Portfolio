import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = () => {
    const { isLoggedIn } = useAuth();
    
    // Agar logged in hai, toh child component (Profile) render karein
    if (isLoggedIn) {
        return <Outlet />;
    }

    // Agar logged in nahi hai, toh user ko /login page par redirect karein
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;