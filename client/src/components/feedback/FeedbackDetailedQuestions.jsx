import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackDetailedQuestions = () => {
  const { feedback, interview, expandedQuestions, toggleQuestion } = useFeedbackPage();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Find below interview question with correct answer, Your answer and feedback for improvement
      </h2>

      {feedback.detailedFeedback?.map((questionFeedback, index) => {
        const question = interview.questions[questionFeedback.questionNumber - 1];
        const isExpanded = expandedQuestions.includes(questionFeedback.questionNumber);

        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleQuestion(questionFeedback.questionNumber)}
              className="w-full bg-gray-50 p-6 border-b border-gray-200 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg flex-1">
                  {question?.question}
                </h3>
                {isExpanded ? (
                  <ChevronUp className="text-gray-600 shrink-0 ml-4" size={24} />
                ) : (
                  <ChevronDown className="text-gray-600 shrink-0 ml-4" size={24} />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="p-6 space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">
                    Rating: {questionFeedback.score}/10
                  </h4>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="font-medium text-pink-900 mb-2">
                    Your Answer:
                  </h4>
                  <p className="text-pink-900 text-sm whitespace-pre-wrap">
                    {interview.answers[questionFeedback.questionNumber - 1] || 'No answer provided'}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">
                    Correct Answer:
                  </h4>
                  <p className="text-green-900 text-sm">
                    {question?.idealAnswer || question?.expectedAnswer || 'No ideal answer available'}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Feedback:
                  </h4>
                  <p className="text-blue-900 text-sm">
                    {questionFeedback.feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FeedbackDetailedQuestions;
