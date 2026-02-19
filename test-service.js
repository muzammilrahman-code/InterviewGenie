// Test the updated GeminiService with correct model
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAcNLhSFyh_LiUeWtfU4liSbNCjK41clq0';

class TestGeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async generateInterviewQuestions({ jobPosition, jobDescription, experience }) {
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
    6. Provide detailed ideal answers for comparison during feedback

    Return ONLY a valid JSON array in this exact format:
    [
      {
        "id": 1,
        "question": "Your question here",
        "type": "technical|conceptual|practical",
        "difficulty": "easy|medium|hard",
        "expectedAnswer": "Brief outline of what a good answer should include",
        "idealAnswer": "Comprehensive ideal answer that demonstrates deep understanding and best practices",
        "followUpQuestions": ["Optional follow-up question 1", "Optional follow-up question 2"],
        "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
      }
    ]

    Do not include any text before or after the JSON array.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw response for questions:', text);
      
      // Clean the response to ensure it's valid JSON
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```$/g, '');
      cleanedText = cleanedText.trim();
      
      const questions = JSON.parse(cleanedText);
      
      // Validate the response
      if (!Array.isArray(questions) || questions.length !== 5) {
        throw new Error('Invalid response format from Gemini API');
      }

      return questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw new Error('Failed to generate interview questions. Please try again.');
    }
  }

  async generateFeedback({ questions, answers, userPerformance }) {
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
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw response for feedback:', text);
      
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/\n?```$/g, '');
      cleanedText = cleanedText.trim();
      
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error generating feedback with Gemini:', error);
      throw new Error('Failed to generate feedback. Please try again.');
    }
  }
}

// Test the service
async function testService() {
  console.log('🧪 Testing Updated GeminiService...\n');
  
  const service = new TestGeminiService();
  
  // Test question generation
  console.log('1. Testing question generation...');
  try {
    const questions = await service.generateInterviewQuestions({
      jobPosition: 'Frontend Developer',
      jobDescription: 'React, JavaScript, TypeScript, HTML, CSS, Redux, Node.js',
      experience: '2-3'
    });
    
    console.log(`✅ Generated ${questions.length} questions successfully!`);
    questions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.question.substring(0, 60)}...`);
    });
    
    // Test feedback generation
    console.log('\n2. Testing feedback generation...');
    const mockAnswers = [
      'React is a JavaScript library for building user interfaces',
      'I use console.log and browser dev tools',
      'Classes are templates, objects are instances',
      'I would use state management',
      'Testing helps catch bugs early'
    ];
    
    const feedback = await service.generateFeedback({
      questions: questions,
      answers: mockAnswers,
      userPerformance: {
        totalTime: 300,
        questionsAttempted: 5,
        confidenceLevel: 'medium'
      }
    });
    
    console.log('✅ Generated feedback successfully!');
    console.log(`   Overall Score: ${feedback.overallScore}`);
    console.log(`   Grade: ${feedback.overallGrade}`);
    console.log(`   Strengths: ${feedback.strengths?.length || 0}`);
    console.log(`   Areas for improvement: ${feedback.areasForImprovement?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testService();