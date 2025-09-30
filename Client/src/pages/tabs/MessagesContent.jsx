// File: src/components/tabs/MessagesContent.jsx
import React from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const MessagesContent = ({ messages, handleApiCall, fetchDashboardData }) => {
    
    const handleMessageReadToggle = async (id, isRead) => {
        const result = await handleApiCall(`${API_URL}/api/admin/messages/${id}`, 'PUT', { isRead: !isRead });
        if (result) {
            alert(`Message marked as ${!isRead ? 'read' : 'unread'}.`);
            fetchDashboardData();
        }
    };

    const handleMessageDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) return;
        const result = await handleApiCall(`${API_URL}/api/admin/messages/${id}`, 'DELETE');
        if (result) {
            alert('Message deleted successfully!');
            fetchDashboardData();
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Contact Messages ({messages.length})</h3>

            {messages.length === 0 ? (
                <p className="text-gray-400">No contact messages received yet.</p>
            ) : (
                <div className="space-y-4">
                    {messages
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((message) => (
                        <div 
                            key={message._id} 
                            className={`p-4 rounded-lg border ${message.isRead ? 'border-gray-700 bg-gray-800' : 'border-indigo-500 bg-gray-700'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-white text-lg">Subject:- <span className="font-normal">{message.subject}</span></h4>
                                    <p className="text-sm text-gray-400">From: <span className="text-cyan-300">{message.name}</span> (<span className='italic'>{message.email}</span>)</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${message.isRead ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {message.isRead ? 'READ' : 'UNREAD'}
                                </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap text-gray-300 border-l-4 border-gray-500 pl-3 py-1">Message:- {message.message}</p>
                            <p className="text-xs text-gray-500 mt-2">Received: {new Date(message.createdAt).toLocaleString()}</p>

                            <div className="flex space-x-3 mt-4 justify-end">
                                <button 
                                    onClick={() => handleMessageReadToggle(message._id, message.isRead)} 
                                    className={`text-sm py-1 px-3 rounded-md transition-colors ${message.isRead ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                                >
                                    Mark as {message.isRead ? 'Unread' : 'Read'}
                                </button>
                                <button 
                                    onClick={() => handleMessageDelete(message._id)} 
                                    className="text-sm bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesContent;