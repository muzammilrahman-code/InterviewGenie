import React from 'react';
import { CheckCircle, Target } from 'lucide-react';
import { useFeedbackPage } from '../../contexts/FeedbackPageContext';

const FeedbackImprovementPlan = () => {
  const { feedback } = useFeedbackPage();

  if (!feedback.improvementPlan) {
    return null;
  }

  return (
    <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
      <h2 className="text-xl font-bold mb-6">Your Personalized Improvement Plan</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Short-term Actions (Next 2 weeks)</h3>
          <ul className="space-y-2">
            {feedback.improvementPlan.shortTerm?.map((action, index) => (
              <li key={index} className="text-indigo-100 text-sm flex items-start gap-2">
                <CheckCircle className="text-indigo-300 mt-0.5 shrink-0" size={16} />
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Long-term Goals (Next 3 months)</h3>
          <ul className="space-y-2">
            {feedback.improvementPlan.longTerm?.map((goal, index) => (
              <li key={index} className="text-indigo-100 text-sm flex items-start gap-2">
                <Target className="text-indigo-300 mt-0.5 shrink-0" size={16} />
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackImprovementPlan;
