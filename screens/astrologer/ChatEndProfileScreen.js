import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChatEndProfileScreen = ({ route, navigation }) => {
  console.log('ChatEndProfileScreen rendered');
  console.log('Route params:', route?.params);
  
  // Check if we have route params
  if (!route || !route.params) {
    console.error('No route params provided to ChatEndProfileScreen');
    // Set default values if params are missing
    route = { params: { 
      profile: { name: 'Unknown User', imageUrl: 'https://via.placeholder.com/150' },
      callDuration: '0 Minutes 0 seconds'
    }};
  }
  
  const { profile, callDuration } = route.params;
  const [startTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // For real-time updating of time displayed on screen
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate elapsed time since the screen was shown
  const getElapsedTime = () => {
    const elapsedMilliseconds = currentTime - startTime;
    
    // If we have a fixed call duration from params, use that instead
    if (callDuration) {
      return callDuration;
    }
    
    // Otherwise calculate elapsed time
    const seconds = Math.floor(elapsedMilliseconds / 1000) % 60;
    const minutes = Math.floor(elapsedMilliseconds / (1000 * 60));
    
    return `${minutes} Minutes ${seconds} seconds`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: profile.imageUrl }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.statusText}>closed</Text>
          </View>
        </View>
        
        <View style={styles.endedBadge}>
          <Text style={styles.endedText}>Ended</Text>
        </View>
      </View>
      
      {/* Today label */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>TODAY</Text>
      </View>
      
      {/* Main content */}
      <View style={styles.chatContainer}>
        {/* Messages would go here - empty for the ended call screen */}
      </View>
      
      {/* Footer with call ended info */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.endedTitle}>Chat has ended</Text>
          <Text style={styles.endedSubtitle}>User has closed this session</Text>
          
          <View style={styles.callTimeContainer}>
            <View style={styles.callTimeIcon}>
              <MaterialIcons name="access-time" size={24} color="#8a8a8a" />
            </View>
            <View style={styles.callTimeInfo}>
              <Text style={styles.callTimeLabel}>TOTAL CALL TIME</Text>
              <Text style={styles.callTimeDuration}>{getElapsedTime()}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              // Use reset to go back to a known screen instead of 'Home'
              navigation.reset({
                index: 0,
                routes: [{ name: 'ProfileScreen' }], // Using ProfileScreen as it definitely exists
              });
            }}
          >
            <Text style={styles.closeButtonText}>Close</Text>
            <MaterialIcons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54', // WhatsApp-like green for header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  backButton: {
    padding: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#CCC',
    fontSize: 14,
  },
  endedBadge: {
    backgroundColor: '#D93025', // Red color for the "Ended" badge
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  endedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLabel: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ECE5DD', // WhatsApp-like chat background
  },
  footer: {
    backgroundColor: '#333',
    padding: 16,
  },
  footerContent: {
    paddingVertical: 20,
  },
  endedTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  endedSubtitle: {
    color: '#8a8a8a',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  callTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  callTimeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8a8a8a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  callTimeInfo: {
    flex: 1,
  },
  callTimeLabel: {
    color: '#8a8a8a',
    fontSize: 12,
  },
  callTimeDuration: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginTop: 16,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ChatEndProfileScreen; 