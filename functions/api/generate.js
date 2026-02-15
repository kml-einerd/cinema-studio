// Cloudflare Pages Function - Gemini API Proxy
export async function onRequestPost(context) {
  // Try env var first, then fall back to client-provided key
  const envKey = context.env.GEMINI_API_KEY;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  };

  try {
    const body = await context.request.json();
    const { prompt, model, aspect_ratio, apiKey } = body;
    
    const GEMINI_API_KEY = apiKey || envKey;
    
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'No API key configured. Please set your Gemini API key in Settings.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build the cinematic prompt with aspect ratio hint
    let fullPrompt = prompt;
    if (aspect_ratio && aspect_ratio !== '1:1') {
      fullPrompt += ` [Aspect ratio: ${aspect_ratio}]`;
    }

    // Select Gemini model - map to available ones
    const modelMap = {
      'gemini-2.5-flash-image': 'gemini-2.5-flash-image',
      'gemini-3-pro-image-preview': 'gemini-3-pro-image-preview',
    };
    const geminiModel = modelMap[model] || 'gemini-2.5-flash-image';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiPayload = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `Gemini API error: ${response.status}`, details: errText }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // Extract image from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    let imageData = null;
    let textResponse = '';

    for (const part of parts) {
      if (part.inlineData) {
        imageData = part.inlineData;
      }
      if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageData) {
      return new Response(JSON.stringify({ 
        error: 'No image generated. The model returned text only.', 
        text: textResponse,
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      url: `data:${imageData.mimeType};base64,${imageData.data}`,
      mimeType: imageData.mimeType,
      text: textResponse,
      model: geminiModel,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    },
  });
}
