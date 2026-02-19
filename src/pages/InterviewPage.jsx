import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, Clock, Mic, MicOff, Play, Volume2, Camera, CameraOff, CheckCircle, FileText, Briefcase, Calendar } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import databaseService from '../services/databaseService';
import geminiService from '../services/geminiService';
import toast from 'react-hot-toast';

const InterviewPage = () => {
  const { id: interviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  
  // Camera refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Text-to-Speech
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (user && interviewId) {
      loadInterview();
    }
  }, [user, interviewId]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isInterviewStarted && !isLoading) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, isLoading]);

  // Camera access effect
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast.error('Unable to access camera. Please check permissions.');
        setIsCameraEnabled(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [isCameraEnabled]);

  const loadInterview = async () => {
    try {
      const interviewData = await databaseService.getInterviewById(interviewId, user.id);
      if (!interviewData) {
        toast.error('Interview not found');
        navigate('/dashboard');
        return;
      }
      setInterview(interviewData);
      setAnswers(new Array(interviewData.questions.length).fill(''));
    } catch (error) {
      toast.error('Failed to load interview');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Text-to-Speech function
  const speakQuestion = (text) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start recording answer
  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Browser does not support speech recognition.');
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  // Stop recording answer  
  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  // Submit current answer
  const submitCurrentAnswer = async () => {
    const answerToSubmit = currentAnswer.trim() || transcript.trim();
    
    if (!answerToSubmit) {
      toast.error('Please provide an answer before submitting.');
      return;
    }

    setIsSubmittingAnswer(true);
    
    try {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = answerToSubmit;
      setAnswers(updatedAnswers);
      
      // Save answer to database
      await databaseService.updateInterview(interviewId, user.id, {
        answers: updatedAnswers
      });
      
      setIsQuestionAnswered(true);
      setCurrentAnswer('');
      resetTranscript();
      toast.success('Answer submitted successfully!');
      
    } catch (error) {
      toast.error('Failed to submit answer. Please try again.');
      console.error('Error submitting answer:', error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setIsQuestionAnswered(false);
      resetTranscript();
    }
  };

  // Update current answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);

  const handleStartInterview = async () => {
    setIsInterviewStarted(true);
    // Update interview status to in-progress
    try {
      await databaseService.updateInterview(interviewId, user.id, { 
        status: 'in-progress',
        startedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating interview status:', error);
    }
  };

  const handleAnswerChange = (answer) => {
    setCurrentAnswer(answer);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      
      toast.success('Interview completed! Generating feedback...');
      
      // Generate feedback using Gemini AI
      const feedback = await geminiService.generateFeedback({
        questions: interview.questions,
        answers: answers,
        userPerformance: {
          totalTime: timer,
          questionsAttempted: answers.filter(a => a.trim()).length,
          confidenceLevel: 'medium'
        }
      });

      // Update interview with final feedback
      await databaseService.completeInterview(interviewId, user.id, answers, feedback);
      
      toast.success('Feedback generated! Redirecting...');
      navigate(`/dashboard/interview/${interviewId}/feedback`);
      
    } catch (error) {
      toast.error('Failed to complete interview. Please try again.');
      console.error('Error completing interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Not Found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = interview?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview?.questions?.length - 1;

  return (
    <div className="max-w-7xl mx-auto p-6">
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

      {!isInterviewStarted ? (
        /* Pre-Interview Screen */
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Job Details & Instructions */}
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

            {/* Instructions */}
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

          {/* Right Side - Webcam & Start */}
          <div className="space-y-5 flex flex-col">
            {/* Webcam Preview */}
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
              
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative" style={{ height: '250px', width: '90%', margin: '0 auto' }}>
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

            {/* Start Interview */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 text-white text-center">
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
      ) : (
        /* Interview Room */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Interview Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1} of {interview?.questions?.length}
                </span>
                <span className="text-sm text-indigo-600 font-medium">
                  {Math.round(((currentQuestionIndex + 1) / interview?.questions?.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / interview?.questions?.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {currentQuestionIndex + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {currentQuestion?.type || 'Technical'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      currentQuestion?.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentQuestion?.difficulty || 'Medium'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 leading-relaxed mb-4">
                  {currentQuestion?.question}
                </h3>
                
                <button
                  onClick={() => speakQuestion(currentQuestion?.question)}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  <Volume2 size={18} />
                  {isSpeaking ? 'Speaking...' : 'Read Question Aloud'}
                </button>
              </div>
            </div>
            
            {/* Answer Section */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Your Answer:</h4>
                
                <textarea
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here or use the microphone..."
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  disabled={isQuestionAnswered}
                />
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={listening ? stopRecording : startRecording}
                    disabled={isQuestionAnswered || !browserSupportsSpeechRecognition}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                      listening 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {listening ? <MicOff size={20} /> : <Mic size={20} />}
                    {listening ? 'Stop Recording' : 'Record Answer'}
                  </button>
                  
                  {listening && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording...</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={submitCurrentAnswer}
                  disabled={isSubmittingAnswer || isQuestionAnswered || (!currentAnswer.trim() && !transcript.trim())}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingAnswer ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>

              {/* Answer Submitted State */}
              {isQuestionAnswered && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 text-green-800">
                    <CheckCircle size={20} />
                    <span className="font-medium">Answer submitted successfully!</span>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Navigation */}
            {isQuestionAnswered && (
              <div className="flex justify-center">
              {isLastQuestion ? (
                <div className="text-center space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">
                      Interview Complete!
                    </h3>
                    <p className="text-yellow-700 mb-4">
                      You've answered all questions. Click below to submit and get your feedback.
                    </p>
                    <button 
                      onClick={handleFinalSubmit}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Generating Feedback...
                        </>
                      ) : (
                        'Submit Final Interview'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Next Question →
                </button>
              )}
              </div>
            )}
          </div>

          {/* Right Side - Camera Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Camera</h3>
                <button
                  onClick={() => setIsCameraEnabled(!isCameraEnabled)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCameraEnabled 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isCameraEnabled ? <Camera size={16} /> : <CameraOff size={16} />}
                  {isCameraEnabled ? 'On' : 'Off'}
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg overflow-hidden relative" style={{ height: '320px' }}>
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
                      <p className="text-gray-600 text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Interview Stats */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-semibold text-gray-900">{currentQuestionIndex + (isQuestionAnswered ? 1 : 0)} / {interview?.questions?.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time Elapsed</span>
                  <span className="font-mono font-semibold text-gray-900">{formatTime(timer)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
