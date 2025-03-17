import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Transparent overlay */}
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => navigation.navigate('MessagingScreen', { initialTab: 'Chat' })}
      />
      
      {/* Bottom popup */}
      <View style={styles.popup}>
        <Text style={styles.title}>Chat has ended</Text>
        <Text style={styles.subtitle}>User has closed this session</Text>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeIconContainer}>
            <MaterialIcons name="access-time" size={24} color="#999" />
          </View>
          <View>
            <Text style={styles.timeLabel}>TOTAL CALL TIME</Text>
            <Text style={styles.timeValue}>{callDuration}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('MessagingScreen', { initialTab: 'Chat' })}
        >
          <Text style={styles.closeButtonText}>Close</Text>
          <MaterialIcons name="east" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#333',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  timeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  timeLabel: {
    color: '#999',
    fontSize: 12,
  },
  timeValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ChatEndProfileScreen; 