// All available image generation models
export const t2iModels = [
  // === Nano Banana (Gemini native image gen) ===
  {
    id: "gemini-2.5-flash-image",
    name: "Nano Banana (2.5 Flash)",
    category: "Gemini",
    endpoint: "gemini-2.5-flash-image",
    type: "gemini",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Fast image generation with Gemini 2.5 Flash.",
        examples: ["A cinematic wide shot of a futuristic city at sunset"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "gemini-3-pro-image-preview",
    name: "Nano Banana Pro (3 Pro)",
    category: "Gemini",
    endpoint: "gemini-3-pro-image-preview",
    type: "gemini",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Highest quality Gemini image generation.",
        examples: ["Photorealistic portrait of an elderly craftsman"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "gemini-3-flash-preview",
    name: "Gemini 3 Flash",
    category: "Gemini",
    endpoint: "gemini-3-flash-preview",
    type: "gemini",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Latest Gemini 3 Flash — fast and capable.",
        examples: ["A watercolor painting of Venice canals at dawn"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    category: "Gemini",
    endpoint: "gemini-2.5-pro",
    type: "gemini",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Gemini 2.5 Pro — premium quality.",
        examples: ["A detailed oil painting of a mountain landscape"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  // === Imagen 4 ===
  {
    id: "imagen-4.0-generate-001",
    name: "Imagen 4",
    category: "Imagen",
    endpoint: "imagen-4.0-generate-001",
    type: "imagen",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Google Imagen 4 — high-fidelity photorealistic images.",
        examples: ["A golden retriever wearing a blue party hat at a birthday celebration"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "imagen-4.0-ultra-generate-001",
    name: "Imagen 4 Ultra",
    category: "Imagen",
    endpoint: "imagen-4.0-ultra-generate-001",
    type: "imagen",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Imagen 4 Ultra — highest resolution and detail.",
        examples: ["Macro photography of a dewdrop on a rose petal, 8K"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "imagen-4.0-fast-generate-001",
    name: "Imagen 4 Fast",
    category: "Imagen",
    endpoint: "imagen-4.0-fast-generate-001",
    type: "imagen",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Imagen 4 Fast — quick generation for rapid iteration.",
        examples: ["A minimalist logo design for a tech startup"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  },
  {
    id: "nano-banana-pro-preview",
    name: "Nano Banana Pro (Preview)",
    category: "Gemini",
    endpoint: "nano-banana-pro-preview",
    type: "gemini",
    inputs: {
      prompt: { type: "string", title: "Prompt", name: "prompt",
        description: "Preview version of Nano Banana Pro.",
        examples: ["Cyberpunk street scene with neon signs in Japanese"] },
      aspect_ratio: { enum: ["1:1","16:9","9:16","4:3","3:4","3:2","2:3"], title: "Aspect Ratio", name: "aspect_ratio", type: "string", default: "1:1" }
    }
  }
];

export function getModelById(id) {
  return t2iModels.find(m => m.id === id) || t2iModels[0];
}

export function getAspectRatiosForModel(modelId) {
  const model = getModelById(modelId);
  return model?.inputs?.aspect_ratio?.enum || ["1:1","16:9","9:16","4:3","3:4"];
}

export function getModelsByCategory() {
  const cats = {};
  t2iModels.forEach(m => {
    if (!cats[m.category]) cats[m.category] = [];
    cats[m.category].push(m);
  });
  return cats;
}
