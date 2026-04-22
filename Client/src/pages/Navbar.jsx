import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);

  const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'certificates', 'contact'];

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoadingResume(true);
        const response = await fetch(`${API_URL}/api/admin/resume`);
        setHasResume(response.ok);
      } catch (error) {
        console.error('Error fetching resume:', error);
        setHasResume(false);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchResume();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.scrollY + window.innerHeight / 2;
      let currentActive = 'hero';

      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        if (element.offsetTop <= scrollThreshold && element.offsetTop + element.offsetHeight > scrollThreshold) {
          currentActive = id;
        }
      });

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLinkClasses = (id) => {
    const baseClasses =
      'font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all after:duration-300';

    return activeSection === id
      ? `${baseClasses} text-cyan-400 after:w-full after:bg-cyan-400`
      : `${baseClasses} hover:text-cyan-400 after:w-0 hover:after:w-full after:bg-cyan-400`;
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const AdminControl = ({ isMobile = false }) => {
    if (!isLoggedIn) {
      return null;
    }

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
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-full">
            Logout
          </button>
        </div>
      );
    }

    return (
      <>
        {profileIcon}
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          Logout
        </button>
      </>
    );
  };

  const ResumeButton = ({ isMobile = false }) => (
    <Link
      to="/resume"
      onClick={isMobile ? toggleMenu : undefined}
      className={`${
        isMobile ? 'block py-2' : 'ml-4 px-6 py-2 flex items-center space-x-2'
      } bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
      title={
        loadingResume
          ? 'Loading...'
          : hasResume
            ? 'Open resume viewer'
            : 'Open resume page'
      }
    >
      <span>{loadingResume ? 'Loading...' : hasResume ? 'View Resume' : 'Resume'}</span>
      {!isMobile ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8m-5-5l5 5m-5-5v5h5" />
        </svg>
      ) : null}
    </Link>
  );

  return (
    <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
          Akhlaque Rahman
        </h3>

        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            <li><a href="#hero" className={getLinkClasses('hero')}>Home</a></li>
            <li><a href="#about" className={getLinkClasses('about')}>About</a></li>
            <li><a href="#experience" className={getLinkClasses('experience')}>Experience</a></li>
            <li><a href="#skills" className={getLinkClasses('skills')}>Skills</a></li>
            <li><a href="#certificates" className={getLinkClasses('certificates')}>Certificates</a></li>
            <li><a href="#projects" className={getLinkClasses('projects')}>Projects</a></li>
            <li><a href="#contact" className={getLinkClasses('contact')}>Contact</a></li>
          </ul>

          <ResumeButton />

          <div className="flex items-center space-x-2">
            <AdminControl />
          </div>
        </nav>

        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4`}>
        <ul className="flex flex-col space-y-4 text-center">
          <li><a href="#hero" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Home</a></li>
          <li><a href="#about" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">About</a></li>
          <li><a href="#experience" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Experience</a></li>
          <li><a href="#skills" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Skills</a></li>
          <li><a href="#certificates" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Certificates</a></li>
          <li><a href="#projects" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Projects</a></li>
          <li><a href="#contact" onClick={toggleMenu} className="block py-2 text-white hover:text-cyan-400 transition-colors">Contact</a></li>
          <li className="flex justify-center mt-4">
            <AdminControl isMobile />
          </li>
          <li>
            <ResumeButton isMobile />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
