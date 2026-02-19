import React, { useState } from 'react';
import { X, Briefcase, FileText, Calendar, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddInterviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
      toast.success('Interview created successfully!');
    } catch (error) {
      toast.error('Failed to create interview. Please try again.');
      console.error('Error creating interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Briefcase className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Create New Interview</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Job Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Position
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                {...register('jobPosition', { 
                  required: 'Job position is required',
                  minLength: { value: 2, message: 'Job position must be at least 2 characters' }
                })}
                type="text"
                placeholder="e.g. Frontend Developer, Data Scientist"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            {errors.jobPosition && (
              <p className="mt-1 text-sm text-red-600">{errors.jobPosition.message}</p>
            )}
          </div>

          {/* Job Description/Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description / Tech Stack
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea
                {...register('jobDescription', { 
                  required: 'Job description is required',
                  minLength: { value: 10, message: 'Job description must be at least 10 characters' }
                })}
                placeholder="Describe the role, required technologies, frameworks, etc."
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </div>
            {errors.jobDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.jobDescription.message}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                {...register('experience', { required: 'Experience level is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                disabled={isLoading}
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years (Entry Level)</option>
                <option value="2-3">2-3 years (Junior)</option>
                <option value="4-6">4-6 years (Mid-Level)</option>
                <option value="7-10">7-10 years (Senior)</option>
                <option value="10+">10+ years (Lead/Principal)</option>
              </select>
            </div>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                'Create Interview'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInterviewModal;