export type RootStackParamList = {
  MainTabs: undefined;
  CreateArtScreen: undefined;
  GenerateScreen: {
    selectedImage?: string;
    originalImageUri?: string; // file:// URI for before/after slider
    styles: string[];
    customPrompt?: string;
    styleIntensity?: number; // 1–5 scale
    userId?: string;
  };
  ResultScreen: {
    images?: string[];
    prompt?: string;
    originalImage?: string; // base64 URI for before/after slider
    fromHistory?: boolean;
    imageUrl?: string;
  };
  HistoryScreen: undefined;
};
