import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import geminiService from '../services/geminiService';
import databaseService from '../services/databaseService';
import toast from 'react-hot-toast';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadInterviews();
    }
  }, [user]);

  const loadInterviews = async () => {
    try {
      const userInterviews = await databaseService.getInterviews(user.id);
      const userStats = await databaseService.getInterviewStats(user.id);
      setInterviews(userInterviews);
      setStats(userStats);
    } catch (error) {
      toast.error('Failed to load interviews');
      console.error('Error loading interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInterview = async (formData) => {
    try {
      const newInterview = await databaseService.createInterview(user.id, formData);
      const questions = await geminiService.generateInterviewQuestions(formData);

      const updatedInterview = await databaseService.updateInterviewWithQuestions(
        newInterview.id,
        user.id,
        questions
      );

      await loadInterviews();
      navigate(`/dashboard/interview/${updatedInterview.id}`);
    } catch (error) {
      toast.error('Failed to create interview. Please try again.');
      console.error('Error creating interview:', error);
      throw error;
    }
  };

  const handleStartInterview = (interviewId) => {
    navigate(`/dashboard/interview/${interviewId}`);
  };

  const handleViewFeedback = (interviewId) => {
    navigate(`/dashboard/interview/${interviewId}/feedback`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <DashboardContext.Provider
      value={{
        user,
        isModalOpen,
        interviews,
        stats,
        isLoading,
        openModal,
        closeModal,
        handleCreateInterview,
        handleStartInterview,
        handleViewFeedback
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
