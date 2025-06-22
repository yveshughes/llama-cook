interface LlamaImageRequest {
  prompt: string;
  image: string; // base64 encoded image
  max_tokens?: number;
  temperature?: number;
}

interface LlamaResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LlamaAPIClient {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.LLAMA_API_KEY || '';
    this.apiEndpoint = process.env.LLAMA_API_ENDPOINT || 'https://api.llama.com/v1';
    
    if (!this.apiKey) {
      console.warn('Llama API key not found in environment variables');
    }
  }

  async analyzeImageWithQuestion(question: string, imageBase64: string): Promise<LlamaResponse> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      
      const response = await fetch(`${this.apiEndpoint}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.2-90b-vision-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are Sous Chef, a helpful cooking assistant. Analyze the ingredients shown in the image and answer cooking-related questions. Be concise and practical.'
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
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Llama API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      return {
        response: data.choices[0].message.content,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error calling Llama API:', error);
      throw error;
    }
  }

  // Helper method to compress image if needed
  async compressImage(base64Image: string, maxWidth: number = 1024): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Return compressed image with lower quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(compressedBase64);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64Image;
    });
  }
}