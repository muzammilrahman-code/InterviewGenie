import React from 'react';
import { Play, MessageSquare, Calendar, Briefcase, Clock } from 'lucide-react';

const InterviewCard = ({ interview, onStart, onFeedback }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Briefcase className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{interview.jobPosition}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={14} />
                {formatDate(interview.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              interview.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : interview.status === 'in-progress'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {interview.status || 'Not Started'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>Experience: {interview.experience}</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-3">
            {interview.jobDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onStart(interview.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Play size={18} />
            {interview.status === 'completed' ? 'Restart' : 'Start'}
          </button>
          <button
            onClick={() => onFeedback(interview.id)}
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            disabled={interview.status !== 'completed'}
          >
            <MessageSquare size={18} />
            Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;