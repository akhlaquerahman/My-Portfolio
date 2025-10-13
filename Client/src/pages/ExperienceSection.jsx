import React, { useState, useEffect } from 'react';
import { FaBriefcase } from 'react-icons/fa'; // Using react-icons for a nice briefcase icon

const API_URL = import.meta.env.VITE_API_URL;

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // 💡 API endpoint for experiences, e.g., /api/admin/experiences
        const response = await fetch(`${API_URL}/api/admin/experiences`);
        if (!response.ok) {
          throw new Error('Failed to fetch experience data');
        }
        const data = await response.json();
        
        // Sort experiences by start date, most recent first
        const sortedData = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setExperiences(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-20 bg-slate-800 min-h-screen">Loading Experience Section...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-20 bg-slate-800 min-h-screen">{error}</div>;
  }

  return (
    <section id="experience" className="bg-slate-800 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements (Consistent with About Section) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            My <span className="text-cyan-400">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* The vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-700"></div>

          {experiences.map((exp, index) => (
            <div key={exp._id || index} className="relative mb-12 flex items-center w-full" style={{ justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end' }}>
              {/* Timeline Content Card */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/25 hover:border-cyan-400 transition-all duration-300">
                  <p className="text-cyan-400 font-semibold text-sm mb-1">{exp.startDate} - {exp.endDate}</p>
                  <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-gray-400 mb-4">{exp.company}</p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                    {exp.description.split('\n').map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Timeline Dot Icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center border-4 border-slate-800">
                <FaBriefcase className="text-white"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;