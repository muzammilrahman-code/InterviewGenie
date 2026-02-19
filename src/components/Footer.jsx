import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a1c2d] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="mb-6">© 2026 InterviewGenie. All Rights Reserved. Developed by Muzammil Rahman</p>
        <div className="flex justify-center gap-8">
          <a href="#" className="hover:text-white transition-colors"><Github size={24} /></a>
          <a href="#" className="hover:text-white transition-colors"><Linkedin size={24} /></a>
          <a href="#" className="hover:text-white transition-colors"><Twitter size={24} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;