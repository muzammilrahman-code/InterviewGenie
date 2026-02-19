// Direct REST API test to check if API key is valid
import https from 'https';



async function testDirectAPI() {
  console.log('Testing direct REST API call...');
  
  // First, let's list available models
  const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(listModelsUrl);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API key is valid!');
      console.log('Available models:');
      data.models.forEach(model => {
        if (model.supportedGenerationMethods?.includes('generateContent')) {
          console.log(`- ${model.name} (supports generateContent)`);
        }
      });
      
      // Test with the first available model
      if (data.models.length > 0) {
        const firstModel = data.models.find(m => m.supportedGenerationMethods?.includes('generateContent'));
        if (firstModel) {
          await testModelGeneration(firstModel.name);
        }
      }
    } else {
      console.log('❌ API call failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testModelGeneration(modelName) {
  console.log(`\n🧪 Testing generation with ${modelName}...`);
  
  const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{ text: 'Generate exactly 3 simple interview questions for a developer. Return only JSON array: [{"question": "question text"}]' }]
    }]
  };
  
  try {
    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Generation successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Generation failed:', data);
    }
  } catch (error) {
    console.error('❌ Generation error:', error.message);
  }
}

testDirectAPI();