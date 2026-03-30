import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { 
  Users, 
  Target, 
  Award, 
  Briefcase, 
  BookOpen, 
  Rocket 
} from 'lucide-react';

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const tabContent = {
    mission: {
      icon: <Target className="mr-2 text-indigo-600" />,
      title: "Our Mission",
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg">
            InterviewGenie is on a mission to revolutionize interview preparation by providing personalized, 
            intelligent AI coaching tailored to individual career aspirations.
          </p>
          <p className="text-base md:text-lg">
            With InterviewGenie, the goal is to bridge the gap between preparation and success, 
            empowering users to unlock their full potential.
          </p>
        </div>
      )
    },
    story: {
      icon: <BookOpen className="mr-2 text-indigo-600" />,
      title: "Our Story",
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg">
            The idea for InterviewGenie was born from firsthand experiences with the challenges of interview preparation. 
            As a solo developer, I wanted to create a platform that simplifies the process and builds confidence in individuals.
          </p>
          <p className="text-base md:text-lg">
            This journey has been a path to the power of passion and innovation, leading to the creation 
            of an impactful tool for career growth.
          </p>
        </div>
      )
    },
    approach: {
      icon: <Rocket className="mr-2 text-indigo-600" />,
      title: "Our Approach",
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg">
            InterviewGenie leverages advanced AI algorithms to generate dynamic, contextually relevant interview 
            questions based on your professional background and goals.
          </p>
          <p className="text-base md:text-lg">
            Through real-time analysis and feedback, the platform provides actionable insights, 
            enabling users to improve with every mock interview attempt.
          </p>
        </div>
      )
    }
  };

  const coreValues = [
    {
      icon: <Award className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Continuous Learning",
      description: "Always striving to improve and provide better tools for growth."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Empowerment",
      description: "Supporting individuals in building confidence and achieving professional success."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Excellence",
      description: "Delivering high-quality, impactful features to simplify interview preparation."
    }
  ];

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mt-8 mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            About InterviewGenie
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Empowering professionals to ace interviews through intelligent, personalized AI coaching.
          </p>
        </header>

        {/* Tabs Section */}
        <section className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8 sm:mb-12 md:mb-16 border border-gray-100">
          <div className="flex flex-col sm:flex-row border-b border-gray-100">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full sm:flex-1 py-4 px-6 flex items-center justify-center transition-all duration-200
                  ${activeTab === tab 
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600 font-semibold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                {tabContent[tab].icon}
                <span className="sm:inline font-medium capitalize">
                  {tab}
                </span>
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-10 md:p-12 animate-in fade-in duration-500">
            {tabContent[activeTab].content}
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className="group text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
    </>
  );
};

export default AboutUsPage;