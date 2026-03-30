import React from 'react';
import { FeedbackPageProvider } from '../contexts/FeedbackPageContext';
import FeedbackPageContent from '../components/feedback/FeedbackPageContent';

const FeedbackPage = () => {
  return (
    <FeedbackPageProvider>
      <FeedbackPageContent />
    </FeedbackPageProvider>
  );
};

export default FeedbackPage;