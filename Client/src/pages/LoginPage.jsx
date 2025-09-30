import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Agar user pehle se logged in hai, toh profile par redirect karein
    if (isLoggedIn) {
        navigate('/profile');
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (login(username, password)) {
            // Success: Profile page par redirect karein
            navigate('/profile');
        } else {
            setError('Invalid username or password. (Hint: admin / password123)');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">Admin Login</h2>
                
                {error && (
                    <div className="bg-red-900 text-red-300 p-3 rounded-md mb-4 text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="admin"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="password123"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;