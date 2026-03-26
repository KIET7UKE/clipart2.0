import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import { THEME } from './src/utils/constant/theme';
import { RootStackParamList } from './src/navigation/rootStackParamList';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={THEME.colors.background}
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          {AppRoutes?.map((route, index) => (
            <Stack.Screen
              key={index}
              name={route.name as keyof RootStackParamList}
              component={route.component}
              options={route.options}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
