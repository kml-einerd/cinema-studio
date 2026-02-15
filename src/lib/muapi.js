// Gemini API Client (replaces Muapi)
export class MuapiClient {
    constructor() {
        this.baseUrl = '';
    }

    getKey() {
        // Key is server-side now, no client key needed
        return 'gemini';
    }

    async generateImage(params) {
        const url = `/api/generate`;

        const payload = {
            prompt: params.prompt,
            model: 'gemini-2.0-flash-preview-image-generation',
            aspect_ratio: params.aspect_ratio || '1:1',
        };

        console.log('[Gemini] Requesting generation:', payload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[Gemini] API Error:', errText);
                throw new Error(`API Request Failed: ${response.status} - ${errText.slice(0, 200)}`);
            }

            const data = await response.json();
            console.log('[Gemini] Response received, has image:', !!data.url);

            if (data.error) {
                throw new Error(data.error);
            }

            return { 
                url: data.url, 
                id: Date.now().toString(),
                text: data.text 
            };

        } catch (error) {
            console.error("Gemini Client Error:", error);
            throw error;
        }
    }
}

export const muapi = new MuapiClient();
