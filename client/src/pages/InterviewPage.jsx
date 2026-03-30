import React from 'react';
import { InterviewPageProvider } from '../contexts/InterviewPageContext';
import InterviewPageContent from '../components/interview/InterviewPageContent';

const InterviewPage = () => {
  return (
    <InterviewPageProvider>
      <InterviewPageContent />
    </InterviewPageProvider>
  );
};

export default InterviewPage;
