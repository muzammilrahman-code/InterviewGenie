import React from 'react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackNextSteps = () => {
  const { feedback } = useFeedbackPage();

  if (!feedback.nextSteps) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps for Success</h2>
      <p className="text-gray-700">{feedback.nextSteps}</p>
    </div>
  );
};

export default FeedbackNextSteps;
