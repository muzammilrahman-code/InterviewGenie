class GeminiService {
  async generateInterviewQuestions({ jobPosition, jobDescription, experience }) {
    try {
      const res = await fetch('/api/gemini/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobPosition, jobDescription, experience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
      return data.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate interview questions. Please try again.');
    }
  }

  async generateFeedback({ questions, answers, userPerformance }) {
    try {
      const res = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers, userPerformance }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate feedback');
      return data.feedback;
    } catch (error) {
      console.error('Error generating feedback:', error);
      throw new Error('Failed to generate feedback. Please try again.');
    }
  }
}

export default new GeminiService();