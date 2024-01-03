import { StyleSheet, useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './theme';
import ListPage from './ListPage';
import { MaterialIcons } from '@expo/vector-icons';


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AnalysisPage from './AnalysisPage';
import HistoryPage from './HistoryPage';
import AccountPage from './AccountPage';
import { useEffect, useState } from 'react';

const ICON_SIZE = 30;
const Tab = createBottomTabNavigator();

const Navigation = (navigation) => {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: theme.background[1],
      borderTopColor: theme.border
    },
  });

  
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home"
        screenOptions={{tabBarActiveTintColor: theme.font[0], tabBarInactiveTintColor: theme.font[1], tabBarStyle: styles.tabBar, tabBarShowLabel: false }} >
        <Tab.Screen name="Home" component={ListPage}
          options={{
            title: '홈', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="list-alt" size={ICON_SIZE} color={color} />
            )
          }} />

        <Tab.Screen name="History" component={HistoryPage}
          options={{
            title: '기록', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="library-books" size={ICON_SIZE} color={color} />
            )
          }} />

        <Tab.Screen name="Analysis" component={AnalysisPage}
          options={{
            title: '분석', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="analytics" size={ICON_SIZE} color={color} />
            )
          }} />

        <Tab.Screen name="Account" component={AccountPage}
          options={{
            title: '계정', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={ICON_SIZE} color={color} />
            )
          }} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {

  return (
    <Navigation></Navigation>
  );
}

// build
// eas build -p android --profile preview