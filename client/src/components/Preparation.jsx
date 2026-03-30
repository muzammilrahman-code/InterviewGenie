import React from 'react';
import { Notebook, Mic, BrainCircuit } from 'lucide-react';

const tips = [
  { title: "Resume Building", icon: <Notebook size={32} />, color: "text-indigo-500", bg: "bg-indigo-50" },
  { title: "Mock Interviews", icon: <Mic size={32} />, color: "text-green-500", bg: "bg-green-50" },
  { title: "Skill Assessment", icon: <BrainCircuit size={32} />, color: "text-purple-500", bg: "bg-purple-50" },
];

const Preparation = () => {
  return (
    <section className="max-w-8xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
        Additional Preparation Tips
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
     {tips.map((tip, idx) => (
     <div 
      key={idx} 
      // The magic happens here:
      className="sm:last:col-span-2 lg:last:col-span-1 w-full max-w-md group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-200 transition-all text-center"
     >
      <div className={`w-16 h-16 ${tip.bg} ${tip.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
        {tip.icon}
      </div>
      <h4 className="text-2xl font-bold text-gray-800 mb-3">{tip.title}</h4>
      <p className="text-gray-500 mb-6">Explore supplementary resources to enhance your career journey.</p>
      <button className="text-indigo-600 font-bold inline-flex items-center gap-2 hover:gap-4 transition-all">
        Explore <span>→</span>
      </button>
    </div>
     ))}
    </div>
    </section>
  );
};

export default Preparation;