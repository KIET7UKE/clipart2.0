import { postAPI } from '../apis/api';

const API_ENDPOINT = '/generate';

interface GenerationResponse {
  imageUrl: string;
}

export const aiService = {
  /**
   * Send image and style prompt to the backend for AI generation.
   * @param imageBase64 The base64-encoded user image.
   * @param styleId The specific clipart style ID.
   * @param customPrompt Optional extra descriptors from the user.
   * @param styleIntensity 1–5 scale controlling how strong the style effect is.
   * @returns The generated image URL.
   */
  generateClipart: async (
    imageBase64: string,
    styleId: string,
    customPrompt?: string,
    styleIntensity: number = 3,
  ): Promise<string> => {
    try {
      const response = await postAPI<GenerationResponse>(API_ENDPOINT, {
        image: imageBase64,
        styleId,
        customPrompt: customPrompt || undefined,
        styleIntensity,
      });

      if (response && response.imageUrl) {
        return response.imageUrl;
      }

      throw new Error('Unexpected response: Missing image URL.');
    } catch (error: any) {
      console.error(`AI Service Error [${styleId}]:`, error);
      throw error;
    }
  },
};
