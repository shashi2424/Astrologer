import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        setIsChecking(true);
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          // Alert the user before reloading
          Alert.alert(
            'Update Available',
            'A new version is now available. The app will now restart to apply the updates.',
            [
              { 
                text: 'OK', 
                onPress: async () => {
                  await Updates.reloadAsync();
                }
              }
            ]
          );
        }
      } catch (error) {
        // Handle error but don't prevent the app from starting
        console.log('Error checking for updates:', error);
      } finally {
        setIsChecking(false);
      }
    }

    // Only check for updates in production, not in development
    if (!__DEV__) {
      checkForUpdates();
    }
  }, []);

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Checking for updates...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});