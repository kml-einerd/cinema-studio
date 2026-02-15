// No auth modal needed - Gemini API key is server-side
export function AuthModal(onSuccess) {
    // Auto-succeed since key is managed server-side
    localStorage.setItem('muapi_key', 'gemini-server-side');
    if (onSuccess) onSuccess();
}
