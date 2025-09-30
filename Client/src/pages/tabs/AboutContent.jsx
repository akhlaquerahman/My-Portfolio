// File: src/components/tabs/AboutContent.jsx
import React from 'react';

const AboutContent = ({ info, setInfo, handleInfoUpdate }) => {
    return (
        <form onSubmit={handleInfoUpdate} className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Update Bio & Summary</h3>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Professional Summary</label>
                <textarea
                    name="summary"
                    value={info.summary || ''}
                    onChange={(e) => setInfo({ ...info, summary: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
                    rows="6"
                ></textarea>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">About me</label>
                <textarea
                    name="about"
                    value={info.about || ''}
                    onChange={(e) => setInfo({ ...info, about: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
                    rows="6"
                ></textarea>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Experience</label>
                    <input name="experience" type="number" value={info.experience || ''} onChange={(e) => setInfo({ ...info, experience: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Projects</label>
                    <input name="project" type="number" value={info.project || ''} onChange={(e) => setInfo({ ...info, project: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Hackathons</label>
                    <input name="hackathon" type="number" value={info.hackathon || ''} onChange={(e) => setInfo({ ...info, hackathon: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Certificate</label>
                    <input name="certificate" type="number" value={info.certificate || ''} onChange={(e) => setInfo({ ...info, certificate: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Awards</label>
                    <input name="award" type="number" value={info.award || ''} onChange={(e) => setInfo({ ...info, award: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Technology</label>
                    <input name="technology" type="number" value={info.technology || ''} onChange={(e) => setInfo({ ...info, technology: e.target.value })} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white" />
                </div>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer">Save Bio Changes</button>
        </form>
    );
};

export default AboutContent;