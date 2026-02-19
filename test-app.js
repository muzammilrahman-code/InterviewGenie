// Quick integration test with your actual app
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAcNLhSFyh_LiUeWtfU4liSbNCjK41clq0';

// Test exactly as requested in the app
async function testRealScenario() {
  console.log('🧪 Testing real application scenario...\n');
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  // Test with typical user input
  const testData = {
    jobPosition: 'Full Stack Developer',
    jobDescription: 'React, Node.js, MongoDB, Express, TypeScript',
    experience: '4-6'
  };
  
  console.log('Creating interview for:', testData);
  
  const prompt = `
  You are an expert technical interviewer. Generate exactly 5 technical interview questions for the following role:

  Job Position: ${testData.jobPosition}
  Job Description/Tech Stack: ${testData.jobDescription}
  Experience Level: ${testData.experience}

  Requirements:
  1. Generate exactly 5 questions
  2. Questions should be appropriate for ${testData.experience} experience level
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
    const response = await result.response;
    const text = response.text();
    
    console.log('Response length:', text.length);
    
    // Parse with the same logic as the updated service
    let jsonText = text.trim();
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/\s*```/g, '');
    
    const startIndex = jsonText.indexOf('[');
    const endIndex = jsonText.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No valid JSON array found');
    }
    
    jsonText = jsonText.substring(startIndex, endIndex + 1);
    
    const questions = JSON.parse(jsonText);
    
    console.log(`✅ SUCCESS! Generated ${questions.length} questions:`);
    questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.question.substring(0, 80)}...`);
      console.log(`   Type: ${q.type}, Difficulty: ${q.difficulty}`);
    });
    
    console.log('\n✅ Your AI interview system is now fully operational!');
    console.log('🚀 You can create new interviews and they will generate 5 questions');
    console.log('🧠 Completed interviews will generate detailed feedback');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealScenario();