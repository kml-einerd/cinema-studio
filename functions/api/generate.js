// Cloudflare Pages Function - Gemini API Proxy
export async function onRequestPost(context) {
  const GEMINI_API_KEY = 'AIzaSyCI3AEZDmtmJ-CUM86T6bI-PSaWqatrnCg';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await context.request.json();
    const { prompt, model, aspect_ratio } = body;

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

    // Select Gemini model
    const geminiModel = model || 'gemini-2.0-flash-preview-image-generation';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`;

    const geminiPayload = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      }
    };

    console.log('[Gemini] Requesting:', geminiModel);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Gemini] Error:', errText);
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
        error: 'No image generated', 
        text: textResponse,
        raw: data 
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
