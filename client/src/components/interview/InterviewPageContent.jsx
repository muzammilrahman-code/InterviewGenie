import React from 'react';
import { useInterviewPage } from '../../contexts/InterviewPageContext';
import InterviewHeader from './InterviewHeader';
import PreInterviewScreen from './PreInterviewScreen';
import InterviewRoom from './InterviewRoom';

const InterviewPageContent = () => {
  const { isLoading, interview, navigate, isInterviewStarted } = useInterviewPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Not Found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <InterviewHeader />
      {!isInterviewStarted ? <PreInterviewScreen /> : <InterviewRoom />}
    </div>
  );
};

export default InterviewPageContent;
