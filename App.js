import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AppointmentTabs from './src/AppoinntmentTabs';
import HomeScreen from './src/HomeScreen';
const Stack = createNativeStackNavigator();

const options = {
  headerStyle: {
    backgroundColor: '#498F91',
  },
  headerTintColor: 'white',
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{
            title: 'Appointment App',
            ...options,
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name="AppointmentsScreen"
          options={{
            title: 'Appointments',
            ...options,
          }}
          component={AppointmentTabs}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
