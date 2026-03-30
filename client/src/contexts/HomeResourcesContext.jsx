import React, { createContext, useContext } from 'react';
import { Terminal, ShieldCheck } from 'lucide-react';

const HomeResourcesContext = createContext(null);

export const HomeResourcesProvider = ({ children }) => {
  const codingLinks = [
    { name: 'GeeksforGeeks', url: '#' },
    { name: 'LeetCode', url: '#' },
    { name: 'HackerRank', url: '#' }
  ];

  const techLinks = [
    { name: 'InterviewBit', url: '#' },
    { name: 'System Design Primer', url: '#' }
  ];

  const resourceCards = [
    {
      key: 'coding-platforms',
      title: 'Coding Platforms',
      icon: Terminal,
      links: codingLinks,
      colorClass: 'text-indigo-600'
    },
    {
      key: 'technical-prep',
      title: 'Technical Prep',
      icon: ShieldCheck,
      links: techLinks,
      colorClass: 'text-purple-600'
    }
  ];

  return (
    <HomeResourcesContext.Provider value={{ resourceCards }}>
      {children}
    </HomeResourcesContext.Provider>
  );
};

export const useHomeResources = () => {
  const context = useContext(HomeResourcesContext);
  if (!context) {
    throw new Error('useHomeResources must be used within HomeResourcesProvider');
  }
  return context;
};
