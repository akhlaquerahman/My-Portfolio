// File: ProjectsSection.jsx
import React, { useState, useEffect } from 'react';
// 💡 IMPORTANT: Ensure ProjectCard is in a file named ProjectCard.jsx
import ProjectCard from './ProjectCard'; 

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [filter, setFilter] = useState('all');

  // API endpoint for projects
  const API_URL = import.meta.env.VITE_API_URL;
  const PROJECTS_API_URL = `${API_URL}/api/admin/projects`;

  // Define categories based on expected backend data (Frontend, Backend, Full Stack, AI/ML)
  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'Full Stack', label: 'Full Stack' }, // Note: keys match the backend 'category' field
    { key: 'Frontend', label: 'Frontend' },
    { key: 'Backend', label: 'Backend' },
    { key: 'AI/ML', label: 'AI/ML' }
  ];

  // --- DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(PROJECTS_API_URL);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Enhance data: Ensure 'technologies' is present for the ProjectCard UI to function correctly.
        const enhancedData = data.map(project => ({
            ...project,
            // If technologies are not coming from the database, use a default/placeholder list
            technologies: project.technologies || [project.category, 'etc.'], 
            featured: project.featured || false
        }));

        setProjects(enhancedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError(`Failed to load projects. Please ensure the backend is running on ${API_URL} and connected to MongoDB.`);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []); 

  // --- Filtering Logic ---
  const filteredProjects = (() => {
    let filtered = filter === 'all' 
      ? projects 
      : projects.filter(project => project.category === filter);
    
    // Separate featured and non-featured projects
    const featured = filtered.filter(p => p.featured).reverse();
    const nonFeatured = filtered.filter(p => !p.featured).reverse();
    
    // Show featured projects at the top, then new projects
    return [...featured, ...nonFeatured];
  })();
  if (loading) {
    return (
      <section id="projects" className="bg-slate-900 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10 text-center py-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <h3 className="text-2xl font-semibold text-gray-300">Loading projects...</h3>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section id="projects" className="bg-slate-900 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10 text-center py-16">
          <h2 className="text-4xl text-red-500 font-extrabold mb-4">Error Loading Data</h2>
          <p className="text-xl text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Please ensure your backend server is running correctly.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="bg-slate-800 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919631901329?text=Hi%20there!%20I%20came%20across%20your%20portfolio%20and%20I'm%20impressed%20with%20your%20projects!%20I%20would%20like%20to%20discuss%20a%20potential%20opportunity%20with%20you."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        title="Chat with me on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.579 0-3.051.46-4.315 1.331L7.71 3.71a9.996 9.996 0 0 1 10.282-1.1 9.997 9.997 0 0 1 5.238 8.676 9.998 9.998 0 0 1-1.331 4.315l2.05 1.208a11.996 11.996 0 0 0 1.597-5.179A11.994 11.994 0 0 0 12 1.5c-6.338 0-11.516 5.226-11.516 11.659 0 2.036.547 3.956 1.518 5.62l-1.208 2.05A11.994 11.994 0 0 1 .5 12c0-6.627 5.373-12 12-12z"/>
        </svg>
      </a>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Featured <span className="text-cyan-400">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            A showcase of my recent work demonstrating expertise in full-stack development, AI integration, and modern web technologies
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setFilter(category.key)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                filter === category.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                index={index}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl text-gray-400 mb-2">No projects found in this category.</p>
              <p className="text-gray-500">Try adjusting your filter or check back later for new projects!</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{projects.length}</div>
            <div className="text-gray-300">Total Projects</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
            <div className="text-3xl font-bold text-green-400 mb-2">{projects.filter(p => p.featured).length}</div>
            <div className="text-gray-300">Featured</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
            <div className="text-3xl font-bold text-purple-400 mb-2">{projects.filter(p => p.liveUrl).length}</div>
            <div className="text-gray-300">Live Demos</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {new Set(projects.flatMap(p => p.technologies)).size}
            </div>
            <div className="text-gray-300">Technologies</div>
          </div>
        </div>
      </div>

      {/* Custom Animations (keep these) */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-up-delay-1 { animation: fade-in-up 0.8s ease-out 0.2s both; }
      `}</style>
    </section>
  );
};

export default ProjectsSection;