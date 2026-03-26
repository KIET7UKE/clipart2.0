import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, History } from 'lucide-react-native';
import HomeScreen from '../pages/public/HomeScreen';
import HistoryScreen from '../pages/public/HistoryScreen';
import { Colors } from '../utils/theme/DesignSystem';
import { View, Platform, StyleSheet } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { 
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          }
        ],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.labelStyle,
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          if (route.name === 'Home') IconComponent = Home;
          else if (route.name === 'History') IconComponent = History;

          return (
            <View style={focused ? styles.iconFocused : null}>
              {IconComponent && <IconComponent color={color} size={size} strokeWidth={focused ? 2.5 : 2} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarLabel: 'My Art' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background, // Match app background precisely
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)', // Subtle separation
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  labelStyle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  iconFocused: {
    // Optional glow or subtle movement if desired
  }
});

export default MainTabs;
