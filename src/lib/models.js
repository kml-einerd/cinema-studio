// Gemini Image Generation Models
export const t2iModels = [
  {
    id: "gemini-2.0-flash-preview-image-generation",
    name: "Gemini 2.0 Flash",
    endpoint: "gemini-2.0-flash-preview-image-generation",
    inputs: {
      prompt: {
        type: "string",
        title: "Prompt",
        name: "prompt",
        description: "Text prompt describing the image you want to generate.",
        examples: ["A cinematic wide shot of a futuristic city at sunset, neon lights reflecting on wet streets, 8K quality"]
      },
      aspect_ratio: {
        enum: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"],
        title: "Aspect Ratio",
        name: "aspect_ratio",
        type: "string",
        description: "Aspect ratio of the output image.",
        default: "1:1"
      }
    }
  },
  {
    id: "gemini-2.5-flash-image-preview",
    name: "Gemini 2.5 Flash Image",
    endpoint: "gemini-2.5-flash-image-preview",
    inputs: {
      prompt: {
        type: "string",
        title: "Prompt",
        name: "prompt",
        description: "Text prompt for image generation with latest Gemini 2.5.",
        examples: ["A photorealistic portrait of an elderly craftsman in warm studio light"]
      },
      aspect_ratio: {
        enum: ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3"],
        title: "Aspect Ratio",
        name: "aspect_ratio",
        type: "string",
        description: "Aspect ratio of the output image.",
        default: "1:1"
      }
    }
  }
];

export function getModelById(id) {
  return t2iModels.find(m => m.id === id) || t2iModels[0];
}

export function getAspectRatiosForModel(modelId) {
  const model = getModelById(modelId);
  return model?.inputs?.aspect_ratio?.enum || ["1:1", "16:9", "9:16", "4:3", "3:4"];
}
