import { StyleSheet, StatusBar } from 'react-native';
import { theme } from './colors';
import ListPage from './ListPage';
import { MaterialIcons } from '@expo/vector-icons';

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AnalysisPage from './AnalysisPage';
import HistoryPage from './HistoryPage';
import AccountPage from './AccountPage';

const ICON_SIZE = 30;
const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home"
        screenOptions={{ tabBarActiveTintColor: theme.font, tabBarInactiveTintColor: theme.subFont, tabBarStyle: styles.tabBar, tabBarShowLabel: false }} >
        <Tab.Screen name="Home" component={ListPage}
          options={{
            title: '홈', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="list-alt" size={ICON_SIZE} color={color} />
            )
          }} />

        {/* <Tab.Screen name="Search" component={HistoryPage}
          options={{
            title: '알림', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="library-books" size={ICON_SIZE} color={color} />
            )
          }} />

        <Tab.Screen name="Notification" component={AnalysisPage}
          options={{
            title: '검색', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="analytics" size={ICON_SIZE} color={color} />
            )
          }} />

        <Tab.Screen name="Message" component={AccountPage}
          options={{
            title: '메시지', headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={ICON_SIZE} color={color} />
            )
          }} /> */}

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: "space-between",
  },
  tabBar: {
    flex: 0.1,
  },
});

// build
// eas build -p android --profile preview