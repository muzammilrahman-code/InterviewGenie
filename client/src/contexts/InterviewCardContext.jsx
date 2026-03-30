import React, { createContext, useContext } from 'react';

const InterviewCardContext = createContext(null);

export const InterviewCardProvider = ({ interview, children }) => {
  return (
    <InterviewCardContext.Provider value={{ interview }}>
      {children}
    </InterviewCardContext.Provider>
  );
};

export const useInterviewCard = () => {
  const context = useContext(InterviewCardContext);
  if (!context) {
    throw new Error('useInterviewCard must be used within InterviewCardProvider');
  }
  return context;
};
