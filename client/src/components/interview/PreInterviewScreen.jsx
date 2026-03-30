import React from 'react';
import { Briefcase, Calendar, FileText, Play, Camera, CameraOff } from 'lucide-react';
import { useInterviewPage } from '../../contexts/InterviewPageContext';

const PreInterviewScreen = () => {
  const {
    interview,
    isCameraEnabled,
    setIsCameraEnabled,
    videoRef,
    handleStartInterview
  } = useInterviewPage();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Details</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="text-indigo-600 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-gray-900">Position</h3>
                <p className="text-gray-700">{interview?.jobPosition}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-indigo-600 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-gray-900">Experience Level</h3>
                <p className="text-gray-700">{interview?.experience}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="text-indigo-600 mt-1" size={20} />
              <div>
                <h3 className="font-medium text-gray-900">Job Description</h3>
                <p className="text-gray-700 text-sm">{interview?.jobDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Interview Instructions</h2>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>You will be asked {interview?.questions?.length} technical questions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Use the microphone to record your answers or type them</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Click "Text-to-Speech" to hear questions read aloud</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Submit each answer before moving to the next question</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Take your time and provide detailed, thoughtful responses</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-5 flex flex-col">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Camera Preview</h2>
            <button
              onClick={() => setIsCameraEnabled(!isCameraEnabled)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCameraEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isCameraEnabled ? <Camera size={14} /> : <CameraOff size={14} />}
              {isCameraEnabled ? 'Camera On' : 'Camera Off'}
            </button>
          </div>

          <div
            className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative"
            style={{ height: '250px', width: '90%', margin: '0 auto' }}
          >
            {isCameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <CameraOff className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-gray-600">Camera Disabled</p>
                  <p className="text-sm text-gray-500">Enable to see preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white text-center">
          <div className="mb-4">
            <div className="w-13 h-13 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="text-white" size={26} />
            </div>
            <h2 className="text-2xl font-bold mb-1">Ready to Begin?</h2>
            <p className="text-white/90">
              Start your AI-powered mock interview and get personalized feedback
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors transform hover:scale-105"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreInterviewScreen;
