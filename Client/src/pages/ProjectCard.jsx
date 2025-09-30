// File: ProjectCard.jsx
import React, { useState } from 'react';

const ProjectCard = ({ project, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => { setImageLoaded(true); };
  const handleImageError = () => { setImageError(true); setImageLoaded(true); };

  // Ensure technologies is always an array for safe rendering
  const techList = project.technologies || []; 
  
  return (
    <div 
      className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          ⭐ Featured
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-slate-700">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700 text-gray-400">
            <div className="text-4xl mb-2">🖼️</div>
            <span className="text-sm">Image not available</span>
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-2">
              {techList.slice(0, 3).map((tech, techIndex) => (
                <span key={techIndex} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">
                  {tech}
                </span>
              ))}
              {techList.length > 3 && (
                <span className="text-xs bg-slate-600/50 text-gray-300 px-2 py-1 rounded-full border border-slate-500/30">
                  +{techList.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
              {project.title}
            </h3>
            <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full capitalize">
              {project.category}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-300">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {techList.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded-md border border-slate-600/50 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-700/50 hover:bg-slate-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group/btn"
          >
            <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Code
          </a>
          
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-center py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group/btn shadow-lg shadow-cyan-500/25"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          ) : (
            <div className="flex-1 bg-slate-700/30 text-gray-500 text-center py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-5a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </div>
          )}
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-slate-700/30">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {project.featured ? 'Featured' : 'Project'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {techList.length} techs
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;