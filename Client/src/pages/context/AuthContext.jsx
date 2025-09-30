import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
const USER_INFO_KEY = 'userInfo';

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    // Start with data from localStorage
    const [userInfo, setUserInfo] = useState(
        JSON.parse(localStorage.getItem(USER_INFO_KEY)) || null
    );

    // Login function now talks to the API
    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Throw error from backend response
                throw new Error(data.message || 'Login failed');
            }

            // Success: Store user info (including token)
            localStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
            setUserInfo(data);
            return true;
        } catch (error) {
            console.error('Login API Error:', error.message);
            // Return false or re-throw error for LoginPage to handle
            throw new Error(error.message); 
        }
    };

    const logout = () => {
        localStorage.removeItem(USER_INFO_KEY);
        setUserInfo(null);
    };
    
    // isLoggedIn status is derived from userInfo presence
    const isLoggedIn = !!userInfo && !!userInfo.token;

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};