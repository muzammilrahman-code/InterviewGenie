import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackHeader = () => {
  const { navigate, interview, handleRetakeInterview } = useFeedbackPage();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
          <p className="text-gray-600">{interview.jobPosition}</p>
        </div>
      </div>

      <button
        onClick={handleRetakeInterview}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
      >
        <RotateCcw size={20} />
        Retake Interview
      </button>
    </div>
  );
};

export default FeedbackHeader;
