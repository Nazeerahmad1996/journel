import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import Search from '../screens/Search';
import Events from '../screens/Events';
import Setting from '../screens/Profile/Setting';
import Host from '../screens/Host';


const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {

  const premium = true;
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  // navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator tabBarOptions={{ showLabel: false }} initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home-outline" />,
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="magnify" />,
        }}
      />
      {premium && (
        <BottomTab.Screen
          name="Host"
          component={Host}
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="plus-circle" />,
          }}
        />
      )}
      <BottomTab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar-star" />,
        }}
      />
      <BottomTab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="account-outline" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// function getHeaderTitle(route) {
//   const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

//   switch (routeName) {
//     case 'Home':
//       return 'How to get started';
//     case 'Links':
//       return 'Links to learn more';
//   }
// }
