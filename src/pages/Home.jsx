import Navbar from '../components/Navbar'
import React from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';
import Hero from '../components/Hero';
import ResourceCard from '../components/ResourceCard';
import Preparation from '../components/Preparation';
import Footer from '../components/Footer';
import PrepResources from '../components/PrepResources';



const Home = () => {

  const codingLinks = [
    { name: "GeeksforGeeks", url: "#" },
    { name: "LeetCode", url: "#" },
    { name: "HackerRank", url: "#" }
  ];

  const techLinks = [
    { name: "InterviewBit", url: "#" },
    { name: "System Design Primer", url: "#" }
  ];

  return (
    <>
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <PrepResources />
      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10">
        <ResourceCard 
          title="Coding Platforms" 
          icon={Terminal} 
          links={codingLinks} 
          colorClass="text-indigo-600"
        />
        <ResourceCard 
          title="Technical Prep" 
          icon={ShieldCheck} 
          links={techLinks} 
          colorClass="text-purple-600"
        />
      </div>

      <Preparation />
      <Footer />
    </div>
    </>
  )
}

export default Home