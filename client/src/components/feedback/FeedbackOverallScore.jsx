import React from 'react';
import { Trophy, Target, TrendingUp, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackOverallScore = () => {
  const { feedback, getScoreColor, renderStars } = useFeedbackPage();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
      <div className="text-center mb-6">
        <div
          className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full ${getScoreColor(feedback.overallScore)} text-4xl font-bold mb-4`}
        >
          <span>{feedback.overallScore}</span>
          {feedback.overallGrade && (
            <span className="text-lg mt-1">{feedback.overallGrade}</span>
          )}
        </div>
        <div className="flex justify-center mb-2">
          {renderStars(feedback.overallScore / 10)}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Performance</h2>
        <p className="text-gray-600">
          {feedback.overallScore >= 80
            ? 'Excellent performance! You\'re well-prepared for interviews.'
            : feedback.overallScore >= 60
              ? 'Good performance with some areas for improvement.'
              : 'Focus on the feedback below to significantly improve your interview skills.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-green-600" size={24} />
            <h3 className="font-bold text-green-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {feedback.strengths?.map((strength, index) => (
              <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={16} />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-yellow-600" size={24} />
            <h3 className="font-bold text-yellow-900">Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {feedback.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-yellow-800 text-sm flex items-start gap-2">
                <XCircle className="text-yellow-600 mt-0.5 shrink-0" size={16} />
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="font-bold text-blue-900">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {feedback.recommendations?.map((recommendation, index) => (
              <li key={index} className="text-blue-800 text-sm flex items-start gap-2">
                <BookOpen className="text-blue-600 mt-0.5 shrink-0" size={16} />
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackOverallScore;
