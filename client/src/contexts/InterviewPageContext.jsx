import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import databaseService from '../services/databaseService';
import geminiService from '../services/geminiService';
import toast from 'react-hot-toast';

const InterviewPageContext = createContext(null);

export const InterviewPageProvider = ({ children }) => {
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (user && interviewId) {
      loadInterview();
    }
  }, [user, interviewId]);

  useEffect(() => {
    let interval;
    if (isInterviewStarted && !isLoading) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewStarted, isLoading]);

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
        streamRef.current.getTracks().forEach((track) => track.stop());
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

    return () => {
      stopCamera();
    };
  }, [isCameraEnabled]);

  useEffect(() => {
    if (transcript) {
      setCurrentAnswer(transcript);
    }
  }, [transcript]);

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

  const startRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Browser does not support speech recognition.');
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setIsQuestionAnswered(false);
      resetTranscript();
    }
  };

  const handleStartInterview = async () => {
    setIsInterviewStarted(true);
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

      const feedback = await geminiService.generateFeedback({
        questions: interview.questions,
        answers,
        userPerformance: {
          totalTime: timer,
          questionsAttempted: answers.filter((a) => a.trim()).length,
          confidenceLevel: 'medium'
        }
      });

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

  const currentQuestion = interview?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview?.questions?.length - 1;

  return (
    <InterviewPageContext.Provider
      value={{
        interview,
        isLoading,
        navigate,
        timer,
        formatTime,
        isInterviewStarted,
        handleStartInterview,
        isCameraEnabled,
        setIsCameraEnabled,
        videoRef,
        currentQuestionIndex,
        currentQuestion,
        isSpeaking,
        speakQuestion,
        currentAnswer,
        handleAnswerChange,
        isQuestionAnswered,
        listening,
        stopRecording,
        startRecording,
        browserSupportsSpeechRecognition,
        isSubmittingAnswer,
        submitCurrentAnswer,
        transcript,
        isLastQuestion,
        handleFinalSubmit,
        handleNextQuestion
      }}
    >
      {children}
    </InterviewPageContext.Provider>
  );
};

export const useInterviewPage = () => {
  const context = useContext(InterviewPageContext);
  if (!context) {
    throw new Error('useInterviewPage must be used within InterviewPageProvider');
  }
  return context;
};
