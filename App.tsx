import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppRoutes } from './appRoutes';
import { RootStackParamList } from './src/navigation/rootStackParamList';
import { ToastProvider } from './src/components/ToastProvider';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar 
            barStyle={'light-content'} 
            backgroundColor={'#0E0E0E'} 
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
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
