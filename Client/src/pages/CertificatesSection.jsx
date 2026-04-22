import React, { useState, useEffect } from 'react';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';

// API URL ko environment variable se lein
const API_URL = import.meta.env.VITE_API_URL;
const buildCertificateViewUrl = (id) => `${API_URL}/api/admin/certificates/${id}/view`;

const CertificatesSection = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook ko backend se data fetch karne ke liye update kiya gaya hai
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                // Backend API endpoint se data fetch karein
                const response = await fetch(`${API_URL}/api/admin/certificates`);
                if (!response.ok) {
                    throw new Error('Failed to fetch certificates from the server.');
                }
                const data = await response.json();
                setCertificates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []); // Empty dependency array ensures this runs only once on mount

    if (loading) {
        return <div className="text-center text-white py-20 bg-slate-800 min-h-screen">Loading Certificates Section...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 py-20 bg-slate-800 min-h-screen">{error}</div>;
    }

    return (
        <section id="certificates" className="bg-slate-800 text-white py-16 px-4 md:px-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Licenses & <span className="text-cyan-400">Certificates</span>
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
                </div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div
                            key={cert._id}
                            className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/25 hover:border-cyan-400 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <FaAward className="text-5xl text-cyan-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                            <p className="text-gray-400 mb-1">{cert.issuer}</p>
                            <p className="text-gray-500 text-sm mb-4">Issued: {cert.date}</p>
                            
                            {/* Description (agar मौजूद hai to dikhaye) */}
                            {cert.description && (
                                <p className="text-sm text-gray-300 mb-6 text-left">{cert.description}</p>
                            )}
                            
                            <a
                                href={buildCertificateViewUrl(cert._id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-auto inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-5 rounded-lg hover:scale-105 transition-transform duration-300"
                            >
                                View Credential
                                <FaExternalLinkAlt />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;
