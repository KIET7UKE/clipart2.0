export type RootStackParamList = {
  HomeScreen: undefined;
  CreateArtScreen: undefined;
  GenerateScreen: { 
    selectedImage?: string; 
    styles: string[]; 
  };
  ResultScreen: { images: string[]; prompt: string };
};
