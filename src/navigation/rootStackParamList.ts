export type RootStackParamList = {
  HomeScreen: undefined;
  GenerateScreen: { selectedImage?: string; style?: string };
  ResultScreen: { images: string[]; prompt: string };
};
