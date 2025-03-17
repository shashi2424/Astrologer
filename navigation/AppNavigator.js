import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneAuthScreen from '../screens/astrologer/PhoneAuthScreen'
import VerificationScreen from '../screens/astrologer/VerificationScreen'
import ProfessionScreen from '../screens/astrologer/ProfessionScreen';
import ProfessionDocScreen from '../screens/astrologer/ProfessionDocScreen';
import AwaitingVerficationScreen from '../screens/astrologer/AwaitingVerficationScreen';
import ProfileScreen from '../screens/astrologer/ProfileScreen';
import PrivacyScreen from '../screens/astrologer/PrivacyPolicyScreen';
import TermsScreen from '../screens/astrologer/TermsOfUseScreen';
import ProfileEditScreen from '../screens/astrologer/ProfileEditScreen';
import MessagingScreen from '../screens/astrologer/ChatScreen';
import ChatProfileScreen from '../screens/astrologer/ChatProfileScreen';
import ChatEndProfileScreen from '../screens/astrologer/ChatEndProfileScreen';
import EarningsPageScreen from '../screens/astrologer/EarningsPageScreen';
import AllTransactionsScreen from '../screens/astrologer/AllTransactionsScreen';
import PersonTransactionScreen from '../screens/astrologer/PersonTransactionScreen';
import PackageDetailsScreen from '../screens/astrologer/PackageDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    console.log('AppNavigator mounted, screens available:');
    console.log('- ChatEndProfile is configured with:', ChatEndProfileScreen);
  }, []);

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
         <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
         <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
         <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
         <Stack.Screen name="ChatProfileScreen" component={ChatProfileScreen} />
         <Stack.Screen 
           name="ChatEndProfile" 
           component={ChatEndProfileScreen} 
           options={{ 
             gestureEnabled: false,
             animationEnabled: true,
             cardStyle: { backgroundColor: 'transparent' },
             presentation: 'transparentModal',
             cardOverlayEnabled: true
           }}
         />
         <Stack.Screen name="EarningsPageScreen" component={EarningsPageScreen} />
         <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
         <Stack.Screen name="TermsScreen" component={TermsScreen} />
         <Stack.Screen name="AllTransactionsScreen" component={AllTransactionsScreen} />
         <Stack.Screen name="PersonTransactionScreen" component={PersonTransactionScreen} />
         <Stack.Screen name="PackageDetailsScreen" component={PackageDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;