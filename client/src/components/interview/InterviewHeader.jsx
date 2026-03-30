import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useInterviewPage } from '../../contexts/InterviewPageContext';

const InterviewHeader = () => {
  const { navigate, interview, formatTime, timer } = useInterviewPage();

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
          <h1 className="text-2xl font-bold text-gray-900">Mock Interview Session</h1>
          <p className="text-gray-600">{interview?.jobPosition}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={20} />
          <span className="font-mono">{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
};

export default InterviewHeader;
