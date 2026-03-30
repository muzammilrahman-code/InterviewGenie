import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Star } from 'lucide-react';
import databaseService from '../services/databaseService';
import toast from 'react-hot-toast';

const FeedbackPageContext = createContext(null);

export const FeedbackPageProvider = ({ children }) => {
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
    setExpandedQuestions((prev) => (
      prev.includes(questionNumber)
        ? prev.filter((num) => num !== questionNumber)
        : [...prev, questionNumber]
    ));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade) => {
    const gradeMap = {
      'A+': 'text-green-700 bg-green-100',
      A: 'text-green-700 bg-green-100',
      'A-': 'text-green-600 bg-green-50',
      'B+': 'text-blue-700 bg-blue-100',
      B: 'text-blue-600 bg-blue-100',
      'B-': 'text-blue-600 bg-blue-50',
      'C+': 'text-yellow-700 bg-yellow-100',
      C: 'text-yellow-600 bg-yellow-100',
      'C-': 'text-orange-600 bg-orange-100',
      D: 'text-red-600 bg-red-100',
      F: 'text-red-700 bg-red-100'
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

  const feedback = interview?.feedback;

  return (
    <FeedbackPageContext.Provider
      value={{
        interview,
        feedback,
        isLoading,
        navigate,
        handleRetakeInterview,
        expandedQuestions,
        toggleQuestion,
        getScoreColor,
        getGradeColor,
        renderStars
      }}
    >
      {children}
    </FeedbackPageContext.Provider>
  );
};

export const useFeedbackPage = () => {
  const context = useContext(FeedbackPageContext);
  if (!context) {
    throw new Error('useFeedbackPage must be used within FeedbackPageProvider');
  }
  return context;
};
