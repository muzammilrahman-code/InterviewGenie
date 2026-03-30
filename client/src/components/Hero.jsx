import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="text-center px-4 py-20 bg-gradient-to-b from-purple-100/50 to-white">
      <div className="max-w-4xl mx-auto mt-20 md:mt-12">
        <h1 className="text-2xl md:text-5xl mt-10 font-extrabold text-gray-900 mb-6">
          Your Personal AI <span className="text-indigo-600">Interview Coach</span>
        </h1>
        <p className="max-w-xl mx-auto text-gray-600 text-lg md:text-xl mb-10 leading-relaxed">
          Double your chances of landing that job offer with our AI-powered interview prep.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate("/how-it-works")} 
            className="text-gray-700 font-semibold px-5 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-all">
            Learn more →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
