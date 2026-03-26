import { getAPI, postAPI } from '../apis/api';

const API_ENDPOINT = '/generate';
const HISTORY_ENDPOINT = '/history';

interface GenerationResponse {
  imageUrl: string;
}

export interface ClipartHistory {
  _id: string;
  userId: string;
  styleId: string;
  originalPrompt: string;
  finalPrompt: string;
  imageUrl: string;
  styleIntensity: number;
  createdAt: string;
}

export const aiService = {
  /**
   * Send image and style prompt to the backend for AI generation.
   */
  generateClipart: async (
    imageBase64: string,
    styleId: string,
    customPrompt?: string,
    styleIntensity: number = 3,
    userId?: string, // Associate generation with a user
  ): Promise<string> => {
    try {
      const response = await postAPI<GenerationResponse>(API_ENDPOINT, {
        image: imageBase64,
        styleId,
        customPrompt: customPrompt || undefined,
        styleIntensity,
        userId,
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

  /**
   * Fetch generation history for a specific user.
   */
  getHistory: async (userId: string): Promise<ClipartHistory[]> => {
    try {
      const response = await getAPI<{ history: ClipartHistory[] }>(`${HISTORY_ENDPOINT}/${userId}`);
      return response.history || [];
    } catch (error: any) {
      console.error(`AI Service History Error:`, error);
      throw error;
    }
  },
};
