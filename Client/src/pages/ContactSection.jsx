import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const CONTACT_API_URL = `${API_URL}/api/admin/messages`;

const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/in/akhlaque-rahman-6b1410293',
  github: 'https://github.com/AkhlaqueRahman',
  twitter: 'https://x.com/Akhlaque9631',
  instagram: 'https://www.instagram.com/mr__.rahman_/?hl=en',
  facebook: 'https://www.facebook.com/akhlaque.rahman.92/',
};

const FACEBOOK_SVG =
  'M22.676 0H1.324C.592 0 0 .592 0 1.324v21.352C0 23.408.592 24 1.324 24h11.492v-9.294H9.688V10.37h3.128V7.933c0-3.128 1.893-4.819 4.653-4.819 1.324 0 2.46.099 2.798.143v3.238h-1.99c-1.564 0-1.875.741-1.875 1.839v2.54h3.518l-.57 3.518h-2.948V24h6.115c.732 0 1.324-.592 1.324-1.324V1.324C24 .592 23.408 0 22.676 0z';
const INSTAGRAM_SVG =
  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15h3a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 6h-3A1.5 1.5 0 009 7.5v7A1.5 1.5 0 0010.5 17zM12 10a2 2 0 100 4 2 2 0 000-4zm4.5-3.5a1 1 0 100 2 1 1 0 000-2z';

const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const ContactSection = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (!status.message) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setStatus({ type: '', message: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [status.message]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const invalidEmailMessage = 'Invalid email. Please enter a correct or valid email address.';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setStatus({ type: '', message: '' });

    if (name === 'email') {
      const trimmedEmail = value.trim();
      if (!trimmedEmail) {
        setEmailError('');
      } else {
        setEmailError(validateEmail(trimmedEmail) ? '' : invalidEmailMessage);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setEmailError('');

    if (!validateEmail(formData.email.trim())) {
      setEmailError(invalidEmailMessage);
      setStatus({
        type: 'error',
        message: invalidEmailMessage,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully! I will respond shortly.',
        });
        setFormData(INITIAL_FORM_DATA);
        return;
      }

      if (data.message?.toLowerCase().includes('invalid email')) {
        setEmailError(invalidEmailMessage);
      }

      setStatus({
        type: 'error',
        message: data.message || 'Failed to send message. Please try again.',
      });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        type: 'error',
        message: 'Connection failed. Please ensure the backend server is running.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusMessage = () => {
    if (!status.message) {
      return null;
    }

    const baseClasses = 'p-4 rounded-lg font-semibold mb-6 text-center';
    const successClasses = 'bg-green-900 text-green-300';
    const errorClasses = 'bg-red-900 text-red-300';

    return (
      <div
        className={
          status.type === 'success'
            ? `${baseClasses} ${successClasses}`
            : `${baseClasses} ${errorClasses}`
        }
      >
        {status.message}
      </div>
    );
  };

  return (
    <section id="contact" className="bg-slate-900 py-20 px-4 md:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Let&apos;s Work Together
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have an exciting project in mind? I&apos;d love to hear about it! Let&apos;s create something
            amazing together.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  @
                </span>
                Get In Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">akhlaquerahman18@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-semibold">Ludhiana, Punjab, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Response Time</p>
                    <p className="text-white font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <h4 className="text-xl font-bold text-white mb-6">Connect With Me</h4>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-800/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors">LinkedIn</span>
                </a>

                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-gradient-to-r hover:from-gray-600/20 hover:to-gray-800/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors">GitHub</span>
                </a>

                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-gradient-to-r hover:from-blue-400/20 hover:to-blue-600/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Twitter</span>
                </a>

                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d={INSTAGRAM_SVG} />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Instagram</span>
                </a>

                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-lg hover:bg-gradient-to-r hover:from-blue-700/20 hover:to-blue-900/20 transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d={FACEBOOK_SVG} />
                  </svg>
                  <span className="text-gray-300 group-hover:text-white transition-colors">Facebook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
            <StatusMessage />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={(event) => {
                      const trimmedEmail = event.target.value.trim();
                      if (!trimmedEmail) {
                        setEmailError('');
                        return;
                      }
                      setEmailError(validateEmail(trimmedEmail) ? '' : invalidEmailMessage);
                    }}
                    required
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      emailError ? 'border-red-500 focus:ring-red-400' : 'border-slate-600/50 focus:ring-cyan-400'
                    }`}
                    placeholder="Enter your email"
                  />
                  {emailError ? <p className="text-red-400 text-sm mt-1">{emailError}</p> : null}
                </div>
              </div>

              <div className="group">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  placeholder="What's this about?"
                />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 cursor-pointer">
                    <span>Send Message</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
