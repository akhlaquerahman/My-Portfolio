// Client/src/pages/HomePage.jsx
import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import ExperienceSection from './ExperienceSection';
import CertificatesSection from './CertificatesSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <CertificatesSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
};

export default HomePage;