import React from 'react';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle,
  Camera,
  CameraOff
} from 'lucide-react';
import { useInterviewPage } from '../../contexts/InterviewPageContext';

const InterviewRoom = () => {
  const {
    interview,
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
    isLoading,
    handleNextQuestion,
    isCameraEnabled,
    setIsCameraEnabled,
    videoRef,
    formatTime,
    timer
  } = useInterviewPage();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {interview?.questions?.length}
            </span>
            <span className="text-sm text-indigo-600 font-medium">
              {Math.round(((currentQuestionIndex + 1) / interview?.questions?.length) * 100)}%
              {' '}Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / interview?.questions?.length) * 100}%` }}
            ></div>
          </div>
        </div>

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
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentQuestion?.difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : currentQuestion?.difficulty === 'hard'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
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

        {isQuestionAnswered && (
          <div className="flex justify-center">
            {isLastQuestion ? (
              <div className="text-center space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Interview Complete!</h3>
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

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Questions Answered</span>
              <span className="font-semibold text-gray-900">
                {currentQuestionIndex + (isQuestionAnswered ? 1 : 0)} / {interview?.questions?.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Time Elapsed</span>
              <span className="font-mono font-semibold text-gray-900">{formatTime(timer)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
