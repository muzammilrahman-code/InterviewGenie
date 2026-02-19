// Simple API test to verify Gemini integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAcNLhSFyh_LiUeWtfU4liSbNCjK41clq0';

async function testAPI() {
  console.log('Testing Gemini API connectivity...');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not set');
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Test with different model names that should work
    const modelNames = [
      'gemini-pro',
      'gemini-1.0-pro',
      'text-bison-001',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest'
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = "Say hello in a friendly way";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}:`, text.substring(0, 100));
        
        // If this model works, test question generation
        await testQuestionGeneration(model);
        break;
        
      } catch (error) {
        console.log(`❌ FAILED with ${modelName}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('API initialization error:', error);
  }
}

async function testQuestionGeneration(model) {
  console.log('\n🧪 Testing question generation...');
  
  const prompt = `Generate exactly 5 technical interview questions for a Frontend Developer with 2-3 years of experience in React, JavaScript, TypeScript.

Return ONLY a valid JSON array with this structure:
[
  {
    "id": 1,
    "question": "Question text here",
    "type": "technical",
    "difficulty": "medium",
    "expectedAnswer": "Brief expected answer",
    "idealAnswer": "Detailed ideal answer",
    "keyPoints": ["Point 1", "Point 2"]
  }
]

No markdown formatting, just the JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response:', text);
    
    // Try to parse as JSON
    const cleanText = text.trim().replace(/```json\n?/, '').replace(/\n?```$/, '');
    const questions = JSON.parse(cleanText);
    
    if (Array.isArray(questions) && questions.length === 5) {
      console.log('✅ Question generation successful!');
      console.log(`Generated ${questions.length} questions`);
      questions.forEach((q, i) => {
        console.log(`${i + 1}. ${q.question}`);
      });
    } else {
      console.log('❌ Invalid question format');
    }
    
  } catch (error) {
    console.error('❌ Question generation failed:', error.message);
  }
}

testAPI();