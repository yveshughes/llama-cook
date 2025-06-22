import { NextRequest, NextResponse } from 'next/server';

// Helper function to ensure structured output
function formatRecipeResponse(rawResponse: string): string {
  // If the response already follows our format, return as is
  if (rawResponse.includes('*') && rawResponse.match(/\*\s+\w+/g)) {
    return rawResponse;
  }
  
  // Otherwise, try to extract ingredients and format them
  const lines = rawResponse.split('\n').filter(line => line.trim());
  const formattedLines: string[] = [];
  let foundIngredients = false;
  
  for (const line of lines) {
    // Check if this line mentions ingredients
    if (line.toLowerCase().includes('ingredient') || line.match(/^[-•]\s*\w+/)) {
      foundIngredients = true;
      // Convert various bullet formats to our standard
      const cleaned = line.replace(/^[-•]\s*/, '* ');
      formattedLines.push(cleaned);
    } else if (foundIngredients && line.match(/^[A-Za-z]+/)) {
      // If we're in the ingredients section and see a plain word, format it
      formattedLines.push(`* ${line}`);
    } else {
      formattedLines.push(line);
    }
  }
  
  return formattedLines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const { question, roomId } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }
    
    // Get the latest frame from the camera stream
    const frameResponse = await fetch(
      `${request.nextUrl.origin}/api/camera-stream?roomId=${roomId || 'demo-room-001'}`
    );
    
    if (!frameResponse.ok) {
      return NextResponse.json(
        { error: 'No camera stream available' },
        { status: 404 }
      );
    }
    
    const frameData = await frameResponse.json();
    
    if (!frameData.frame) {
      return NextResponse.json(
        { error: 'No frame data available' },
        { status: 404 }
      );
    }
    
    // Get Llama API credentials from environment
    const apiKey = process.env.LLAMA_API_KEY;
    const apiEndpoint = process.env.LLAMA_API_ENDPOINT || 'https://api.llama.com/v1';
    
    if (!apiKey) {
      console.error('Llama API key not configured');
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      );
    }
    
    // Remove data URL prefix if present
    const base64Data = frameData.frame.replace(/^data:image\/\w+;base64,/, '');
    
    // Call Llama API directly
    const llamaResponse = await fetch(`${apiEndpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: `You are Sous Chef, a helpful kitchen assistant providing thoughtful creative recipes based on the available ingredients shown in images.

When analyzing ingredients and suggesting recipes, always follow this format:
1. Start with a friendly introduction to the recipe (e.g., "Looks like we can make a delicious [dish name]")
2. Mention key details like prep time and difficulty
3. List all visible ingredients in a bullet format
4. If some common ingredients are missing but likely available, mention them too

Format your ingredient list like this:
* Ingredient 1
* Ingredient 2
* Ingredient 3

Be enthusiastic, helpful, and encouraging!`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: question
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
      }),
    });

    if (!llamaResponse.ok) {
      const errorText = await llamaResponse.text();
      console.error('Llama API error:', llamaResponse.status, errorText);
      
      // Return a more helpful error response for debugging
      return NextResponse.json({
        question,
        answer: `API Error (${llamaResponse.status}): Unable to process your request. Please check the API configuration.`,
        timestamp: new Date().toISOString(),
        debug: {
          status: llamaResponse.status,
          error: errorText.substring(0, 200) // First 200 chars of error
        }
      });
    }

    const data = await llamaResponse.json();
    console.log('Llama API response:', JSON.stringify(data, null, 2));
    
    // Handle Llama 4 response format
    let answer = '';
    if (data.completion_message && data.completion_message.content) {
      // Llama 4 format
      if (data.completion_message.content.text) {
        answer = data.completion_message.content.text;
      } else if (typeof data.completion_message.content === 'string') {
        answer = data.completion_message.content;
      }
    } else if (data.choices && data.choices[0] && data.choices[0].message) {
      // OpenAI format
      answer = data.choices[0].message.content;
    } else if (data.response) {
      answer = data.response;
    } else if (data.text) {
      answer = data.text;
    } else {
      console.error('Unexpected Llama API response format:', data);
      answer = 'Received response but unable to parse it. Please check API response format.';
    }
    
    // Apply formatting to ensure structured output
    const formattedAnswer = formatRecipeResponse(answer);
    
    return NextResponse.json({
      question,
      answer: formattedAnswer,
      timestamp: new Date().toISOString(),
      usage: data.usage
    });
    
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}