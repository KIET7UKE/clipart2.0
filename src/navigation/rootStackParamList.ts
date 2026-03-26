export type RootStackParamList = {
  HomeScreen: undefined;
  CreateArtScreen: undefined;
  GenerateScreen: { 
    selectedImage?: string; 
    originalImageUri?: string; // file:// URI for before/after slider
    styles: string[];
    customPrompt?: string;
    styleIntensity?: number; // 1–5 scale
  };
  ResultScreen: { 
    images: string[]; 
    prompt: string;
    originalImage?: string; // base64 URI for before/after slider
  };
};

