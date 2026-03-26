import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRoutes } from './appRoutes';
import { THEME } from './src/utils/constant/theme';
import { RootStackParamList } from './src/navigation/rootStackParamList';

const Stack = createStackNavigator<RootStackParamList>();

import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
