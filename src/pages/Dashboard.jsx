import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Clock, Target, TrendingUp } from 'lucide-react';
import AddInterviewModal from '../components/AddInterviewModal';
import InterviewCard from '../components/InterviewCard';
import geminiService from '../services/geminiService';
import databaseService from '../services/databaseService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Load interviews on component mount
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
      // Create interview in database
      const newInterview = await databaseService.createInterview(user.id, formData);
      
      // Generate questions using Gemini AI
      const questions = await geminiService.generateInterviewQuestions(formData);
      
      // Update interview with questions
      const updatedInterview = await databaseService.updateInterviewWithQuestions(
        newInterview.id, 
        user.id, 
        questions
      );
      
      // Refresh the interviews list
      await loadInterviews();
      
      // Navigate to the interview page
      navigate(`/dashboard/interview/${updatedInterview.id}`);
      
    } catch (error) {
      toast.error('Failed to create interview. Please try again.');
      console.error('Error creating interview:', error);
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleStartInterview = (interviewId) => {
    navigate(`/dashboard/interview/${interviewId}`);
  };

  const handleViewFeedback = (interviewId) => {
    navigate(`/dashboard/interview/${interviewId}/feedback`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'User'}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to ace your next interview? Let's practice with AI-powered mock interviews.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Target className="text-indigo-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <Trophy className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Add New Interview Card */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Interview</h2>
        <div 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Plus size={32} />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Start New Mock Interview</h3>
            <p className="text-white/90">
              Create a personalized interview based on your target role and experience level
            </p>
          </div>
        </div>
      </div>

      {/* Previous Interviews */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Interviews</h2>
        
        {interviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Target size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first mock interview to get started with AI-powered practice sessions.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Create Your First Interview
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onStart={handleStartInterview}
                onFeedback={handleViewFeedback}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Interview Modal */}
      <AddInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateInterview}
      />
    </div>
  );
};

export default Dashboard;