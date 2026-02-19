import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, Trophy, TrendingUp, Target, MessageSquare, RotateCcw, Star, CheckCircle, XCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import databaseService from '../services/databaseService';
import toast from 'react-hot-toast';

const FeedbackPage = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  useEffect(() => {
    if (user && interviewId) {
      loadInterview();
    }
  }, [user, interviewId]);

  const loadInterview = async () => {
    try {
      const interviewData = await databaseService.getInterviewById(interviewId, user.id);
      if (!interviewData) {
        toast.error('Interview not found');
        navigate('/dashboard');
        return;
      }
      if (!interviewData.feedback) {
        toast.error('Feedback not available for this interview');
        navigate('/dashboard');
        return;
      }
      setInterview(interviewData);
    } catch (error) {
      toast.error('Failed to load interview feedback');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetakeInterview = async () => {
    // Reset interview status and navigate back to interview page
    try {
      await databaseService.updateInterview(interviewId, user.id, {
        status: 'not-started',
        answers: [],
        feedback: null,
        startedAt: null,
        completedAt: null
      });
      navigate(`/dashboard/interview/${interviewId}`);
    } catch (error) {
      toast.error('Failed to reset interview');
    }
  };

  const toggleQuestion = (questionNumber) => {
    setExpandedQuestions(prev => 
      prev.includes(questionNumber) 
        ? prev.filter(num => num !== questionNumber)
        : [...prev, questionNumber]
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade) => {
    const gradeMap = {
      'A+': 'text-green-700 bg-green-100',
      'A': 'text-green-700 bg-green-100',
      'A-': 'text-green-600 bg-green-50',
      'B+': 'text-blue-700 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'B-': 'text-blue-600 bg-blue-50',
      'C+': 'text-yellow-700 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'C-': 'text-orange-600 bg-orange-100',
      'D': 'text-red-600 bg-red-100',
      'F': 'text-red-700 bg-red-100'
    };
    return gradeMap[grade] || 'text-gray-600 bg-gray-100';
  };

  const renderStars = (score) => {
    const stars = Math.round(score);
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
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

  const { feedback } = interview;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
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

      {/* Overall Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
        <div className="text-center mb-6">
          <div className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full ${getScoreColor(feedback.overallScore)} text-4xl font-bold mb-4`}>
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
            {feedback.overallScore >= 80 ? 'Excellent performance! You\'re well-prepared for interviews.' :
             feedback.overallScore >= 60 ? 'Good performance with some areas for improvement.' :
             'Focus on the feedback below to significantly improve your interview skills.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-green-600" size={24} />
              <h3 className="font-bold text-green-900">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {feedback.strengths?.map((strength, index) => (
                <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-yellow-600" size={24} />
              <h3 className="font-bold text-yellow-900">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {feedback.areasForImprovement?.map((area, index) => (
                <li key={index} className="text-yellow-800 text-sm flex items-start gap-2">
                  <XCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="font-bold text-blue-900">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {feedback.recommendations?.map((recommendation, index) => (
                <li key={index} className="text-blue-800 text-sm flex items-start gap-2">
                  <BookOpen className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Question Feedback */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Find below interview question with correct answer, Your answer and feedback for improvement
        </h2>
        
        {feedback.detailedFeedback?.map((questionFeedback, index) => {
          const question = interview.questions[questionFeedback.questionNumber - 1];
          const isExpanded = expandedQuestions.includes(questionFeedback.questionNumber);
          
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Question Header - Clickable */}
              <button
                onClick={() => toggleQuestion(questionFeedback.questionNumber)}
                className="w-full bg-gray-50 p-6 border-b border-gray-200 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg flex-1">
                    {question?.question}
                  </h3>
                  {isExpanded ? (
                    <ChevronUp className="text-gray-600 flex-shrink-0 ml-4" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-600 flex-shrink-0 ml-4" size={24} />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Rating Section */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">
                      Rating: {questionFeedback.score}/10
                    </h4>
                  </div>

                  {/* User's Answer */}
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h4 className="font-medium text-pink-900 mb-2">
                      Your Answer:
                    </h4>
                    <p className="text-pink-900 text-sm whitespace-pre-wrap">
                      {interview.answers[questionFeedback.questionNumber - 1] || 'No answer provided'}
                    </p>
                  </div>

                  {/* Ideal Answer */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">
                      Correct Answer:
                    </h4>
                    <p className="text-green-900 text-sm">
                      {question?.idealAnswer || question?.expectedAnswer || 'No ideal answer available'}
                    </p>
                  </div>

                  {/* Detailed Feedback */}
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

      {/* Improvement Plan */}
      {feedback.improvementPlan && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-xl font-bold mb-6">Your Personalized Improvement Plan</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Short-term Actions (Next 2 weeks)</h3>
              <ul className="space-y-2">
                {feedback.improvementPlan.shortTerm?.map((action, index) => (
                  <li key={index} className="text-indigo-100 text-sm flex items-start gap-2">
                    <CheckCircle className="text-indigo-300 mt-0.5 flex-shrink-0" size={16} />
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
                    <Target className="text-indigo-300 mt-0.5 flex-shrink-0" size={16} />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      {feedback.nextSteps && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps for Success</h2>
          <p className="text-gray-700">
            {feedback.nextSteps}
          </p>
        </div>
      )}

      {/* Action Buttons */}
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
    </div>
  );
};

export default FeedbackPage;