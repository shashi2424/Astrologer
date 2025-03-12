import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneAuthScreen from '../screens/astrologer/PhoneAuthScreen'
import VerificationScreen from '../screens/astrologer/VerificationScreen'
import ProfessionScreen from '../screens/astrologer/ProfessionScreen';
import ProfessionDocScreen from '../screens/astrologer/ProfessionDocScreen';
import AwaitingVerficationScreen from '../screens/astrologer/AwaitingVerficationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="PhoneAuthScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000000' }
        }}
      >
        <Stack.Screen name="PhoneAuthScreen" component={PhoneAuthScreen} />
         <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
         <Stack.Screen name="ProfessionScreen" component={ProfessionScreen} />
         <Stack.Screen name="ProfessionDocScreen" component={ProfessionDocScreen} />
         <Stack.Screen name="AwaitingVerficationScreen" component={AwaitingVerficationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;