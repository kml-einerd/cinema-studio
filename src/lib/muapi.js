// Gemini API Client (replaces Muapi)
export class MuapiClient {
    constructor() {
        this.baseUrl = '';
    }

    getKey() {
        const key = localStorage.getItem('muapi_key');
        if (!key) throw new Error('API Key missing. Please set it in Settings.');
        return key;
    }

    async generateImage(params) {
        const key = this.getKey();
        const url = `/api/generate`;

        const payload = {
            prompt: params.prompt,
            model: params.model || 'gemini-2.5-flash-image',
            aspect_ratio: params.aspect_ratio || '1:1',
            apiKey: key,
        };

        console.log('[Gemini] Requesting generation:', { ...payload, apiKey: '***' });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                const msg = errData.error || `API Request Failed: ${response.status}`;
                throw new Error(msg);
            }

            const data = await response.json();

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
