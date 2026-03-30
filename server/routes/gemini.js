import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// POST /api/gemini/questions
router.post('/questions', async (req, res) => {
  const { jobPosition, jobDescription, experience } = req.body;

  const prompt = `
  You are an expert technical interviewer. Generate exactly 5 technical interview questions for the following role:

  Job Position: ${jobPosition}
  Job Description/Tech Stack: ${jobDescription}
  Experience Level: ${experience}

  Requirements:
  1. Generate exactly 5 questions
  2. Questions should be appropriate for ${experience} experience level
  3. Include a mix of: technical concepts, problem-solving, and practical scenarios
  4. Make questions specific to the technologies and role mentioned
  5. Each question should be challenging but fair for the experience level

  IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanations, no code blocks.
  Use this exact format (keep all text on single lines to avoid JSON parsing issues):

  [{"id":1,"question":"Question text here","type":"technical","difficulty":"medium","expectedAnswer":"Brief expected answer","idealAnswer":"Detailed ideal answer","followUpQuestions":["Follow up 1"],"keyPoints":["Point 1","Point 2"]}]

  Make sure:
  - All strings are on single lines (no line breaks within strings)
  - No backticks or markdown formatting
  - Valid JSON syntax
  - Exactly 5 questions with incrementing IDs
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonText = text.trim().replace(/```json\s*/g, '').replace(/\s*```/g, '');
    const startIndex = jsonText.indexOf('[');
    const endIndex = jsonText.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
      return res.status(500).json({ error: 'No valid JSON array found in response' });
    }

    const questions = JSON.parse(jsonText.substring(startIndex, endIndex + 1));

    if (!Array.isArray(questions) || questions.length !== 5) {
      return res.status(500).json({ error: 'Invalid response format from Gemini API' });
    }

    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate interview questions. Please try again.' });
  }
});

// POST /api/gemini/feedback
router.post('/feedback', async (req, res) => {
  const { questions, answers, userPerformance } = req.body;

  const prompt = `
  As an expert technical interviewer, provide comprehensive feedback for this interview session:

  Interview Questions, Ideal Answers, and User Responses:
  ${questions.map((q, index) => `
  Question ${index + 1}: ${q.question}
  Ideal Answer: ${q.idealAnswer || q.expectedAnswer}
  Key Points to Cover: ${q.keyPoints?.join(', ') || 'N/A'}
  User's Answer: ${answers[index] || 'No answer provided'}
  `).join('\n')}

  Performance Metrics:
  - Total Time: ${userPerformance.totalTime || 'N/A'} seconds
  - Questions Attempted: ${userPerformance.questionsAttempted || 0}/5
  - Confidence Level: ${userPerformance.confidenceLevel || 'N/A'}

  Provide detailed feedback in this JSON format:
  {
    "overallScore": 85,
    "overallGrade": "B+",
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "areasForImprovement": ["Area 1", "Area 2", "Area 3"],
    "detailedFeedback": [
      {
        "questionNumber": 1,
        "score": 8,
        "grade": "B+",
        "feedback": "Detailed feedback comparing user's answer to ideal answer",
        "keyPointsCovered": ["Point 1", "Point 2"],
        "missedPoints": ["Missed point 1"],
        "suggestions": "Specific suggestions for improvement"
      }
    ],
    "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
    "nextSteps": "Specific advice for continued learning and preparation",
    "improvementPlan": {
      "shortTerm": ["Action 1", "Action 2"],
      "longTerm": ["Goal 1", "Goal 2"]
    }
  }

  Scoring Guidelines:
  - 9-10: Exceptional answer covering all key points with depth
  - 7-8: Good answer covering most key points
  - 5-6: Average answer with some key points
  - 3-4: Below average, missing several key points
  - 1-2: Poor answer with major gaps
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonText = text.trim().replace(/```json\s*/g, '').replace(/\s*```/g, '');
    const startIndex = jsonText.indexOf('{');
    const endIndex = jsonText.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1) {
      return res.status(500).json({ error: 'No valid JSON object found in response' });
    }

    const feedback = JSON.parse(jsonText.substring(startIndex, endIndex + 1));
    res.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ error: 'Failed to generate feedback. Please try again.' });
  }
});

export default router;
