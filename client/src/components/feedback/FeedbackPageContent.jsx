import React from 'react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';
import FeedbackHeader from './FeedbackHeader';
import FeedbackOverallScore from './FeedbackOverallScore';
import FeedbackDetailedQuestions from './FeedbackDetailedQuestions';
import FeedbackImprovementPlan from './FeedbackImprovementPlan';
import FeedbackNextSteps from './FeedbackNextSteps';
import FeedbackActions from './FeedbackActions';

const FeedbackPageContent = () => {
  const { isLoading, interview, feedback, navigate } = useFeedbackPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!interview || !feedback) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback Not Available</h2>
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
    <div className="max-w-5xl mx-auto p-6">
      <FeedbackHeader />
      <FeedbackOverallScore />
      <FeedbackDetailedQuestions />
      <FeedbackImprovementPlan />
      <FeedbackNextSteps />
      <FeedbackActions />
    </div>
  );
};

export default FeedbackPageContent;
