import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 

const RESUME_DRIVE_LINK = 'https://drive.google.com/drive/folders/1fCNruei836CoLnNmg0A-GttHQGP5yFa3?usp=sharing';

const Navbar = () => {
    // --- Authentication State ---
    const { isLoggedIn, logout } = useAuth(); 
    
    const [activeSection, setActiveSection] = useState('hero');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];

    // --- (Scroll and Link Classes functions remain the same) ---
    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = window.scrollY + window.innerHeight / 2;
            let currentActive = 'hero';
            sections.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.offsetTop <= scrollThreshold && element.offsetTop + element.offsetHeight > scrollThreshold) {
                        currentActive = id;
                    }
                }
            });
            setActiveSection(currentActive);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getLinkClasses = (id) => {
        const baseClasses = "font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300";
        if (activeSection === id) {
            return `${baseClasses} text-cyan-400 after:w-full after:bg-cyan-400`;
        } else {
            return `${baseClasses} hover:text-cyan-400 after:w-0 hover:after:w-full after:bg-cyan-400`;
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false); 
    };

    // --- Component for Profile Icon/Logout (Conditional Logic) ---
    const AdminControl = ({ isMobile = false }) => {
        if (isLoggedIn) {
            // Logged in: Show Profile Icon and Logout Button
            const profileIcon = (
                <Link 
                    to="/profile" 
                    onClick={isMobile ? toggleMenu : undefined}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    title="Admin Dashboard"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </Link>
            );

            if (isMobile) {
                return (
                    <div className="flex justify-center space-x-4">
                        {profileIcon}
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full">Logout</button>
                    </div>
                );
            }
            
            return (
                <>
                    {profileIcon}
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">Logout</button>
                </>
            );
        }
        
        // Logged out: Return null (Show nothing in the spot of the admin controls)
        return null; 
    };

    return (
        <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo/Brand */}
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
                    Akhlaque Rahman
                </h3>
                
                {/* Desktop Navigation Links and Buttons */}
                <nav className="hidden md:flex items-center space-x-8">
                    <ul className="flex space-x-8">
                        <li><a href="#hero" className={getLinkClasses('hero')}>Home</a></li>
                        <li><a href="#about" className={getLinkClasses('about')}>About</a></li>
                        <li><a href="#skills" className={getLinkClasses('skills')}>Skills</a></li>
                        <li><a href="#projects" className={getLinkClasses('projects')}>Projects</a></li>
                        <li><a href="#contact" className={getLinkClasses('contact')}>Contact</a></li>
                    </ul>
                    
                    {/* --- 1. Download CV Link Updated --- */}
                    <a
                        href={RESUME_DRIVE_LINK}
                        target="_blank" // Opens in a new tab
                        rel="noopener noreferrer" // Security measure
                        className="ml-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-2 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                        <span>Download CV</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </a>

                    {/* --- 2. Profile Icon / Logout (Desktop) --- */}
                    {/* Conditional rendering is now inside AdminControl */}
                    <div className="flex items-center space-x-2">
                         <AdminControl />
                    </div>
                   
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="focus:outline-none">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
                <ul className="flex flex-col space-y-4 text-center">
                    <li><a href="#hero" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Home</a></li>
                    <li><a href="#about" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">About</a></li>
                    <li><a href="#skills" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Skills</a></li>
                    <li><a href="#projects" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Projects</a></li>
                    <li><a href="#contact" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Contact</a></li>

                    {/* --- Profile Icon / Logout (Mobile) --- */}
                    {/* Note: Mobile menu mein space-x-2 ki jagah space-y-4 use hota hai. */}
                    <li className="flex justify-center mt-4">
                         <AdminControl isMobile={true} />
                    </li>
                    
                    <li>
                        <a
                            href={RESUME_DRIVE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={toggleMenu}
                            className="block py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Download CV
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;