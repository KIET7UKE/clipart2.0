import HomeScreen from './src/pages/public/HomeScreen';
import CreateArtScreen from './src/pages/public/CreateArtScreen';
import GenerateScreen from './src/pages/public/GenerateScreen';
import ResultScreen from './src/pages/public/ResultScreen';
import HistoryScreen from './src/pages/public/HistoryScreen';

export const AppRoutes = [
  {
    name: 'HomeScreen',
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: 'CreateArtScreen',
    component: CreateArtScreen,
    options: { headerShown: false },
  },
  {
    name: 'GenerateScreen',
    component: GenerateScreen,
    options: { headerShown: false },
  },
  {
    name: 'ResultScreen',
    component: ResultScreen,
    options: { headerShown: false },
  },
  {
    name: 'HistoryScreen',
    component: HistoryScreen,
    options: { headerShown: false },
  },
];
