import React from 'react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackActions = () => {
  const { navigate, handleRetakeInterview } = useFeedbackPage();

  return (
    <div className="flex gap-4 justify-center mt-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Back to Dashboard
      </button>
      <button
        onClick={handleRetakeInterview}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Practice Again
      </button>
    </div>
  );
};

export default FeedbackActions;
