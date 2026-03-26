import { postAPI } from '../apis/api';

const API_ENDPOINT = '/generate';

interface GenerationResponse {
  imageUrl: string;
}

export const aiService = {
  /**
   * Send image and style prompt to the backend for AI generation.
   * @param imageBase64 The base64-encoded user image.
   * @param stylePrompt The specific clipart style prompt.
   * @returns The generated image URL.
   */
  generateClipart: async (
    imageBase64: string,
    styleId: string,
  ): Promise<string> => {
    try {
      const response = await postAPI<GenerationResponse>(API_ENDPOINT, {
        image: imageBase64,
        styleId: styleId, // one of: cartoon | flat | anime | pixel | sketch
      });

      if (response && response.imageUrl) {
        return response.imageUrl;
      }

      throw new Error('Unexpected response: Missing image URL.');
    } catch (error: any) {
      console.error(`AI Service Error [${styleId}]:`, error);
      throw error; // Re-throw the error handled by postAPI
    }
  },
};
