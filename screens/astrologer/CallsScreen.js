import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';

const CallsScreen = ({ navigation }) => {
  // Sample data for call history
  const [callHistory, setCallHistory] = useState([
    {
      id: '1',
      name: 'Dr. Fatima(2)',
      timestamp: 'Yesterday, 4:30PM',
      status: 'Call Ended',
      isOutgoing: true,
      image: 'https://placehold.co/200x200/FF6B6B/FFFFFF.png?text=DF'
    },
    {
      id: '2',
      name: 'Dr. Fatima(2)',
      timestamp: 'Yesterday, 4:30PM',
      status: '',
      isOutgoing: false,
      image: 'https://placehold.co/200x200/FF6B6B/FFFFFF.png?text=DF'
    },
    {
      id: '3',
      name: 'Dr. Fatima(2)',
      timestamp: 'Yesterday, 4:30PM',
      status: 'Call Ended',
      isOutgoing: true,
      image: 'https://placehold.co/200x200/FF6B6B/FFFFFF.png?text=DF'
    },
    {
      id: '4',
      name: 'Dr. Fatima(2)',
      timestamp: 'Yesterday, 4:30PM',
      status: '',
      isIncoming: true,
      image: 'https://placehold.co/200x200/FF6B6B/FFFFFF.png?text=DF'
    },
    {
      id: '5',
      name: 'Dr. Fatima(2)',
      timestamp: 'Yesterday, 4:30PM',
      status: '',
      isOutgoing: true,
      image: 'https://placehold.co/200x200/FF6B6B/FFFFFF.png?text=DF'
    },
  ]);

  // Function to navigate to chat screen
  const handleChatScreen = () => {
    navigation.navigate('ChatScreen');
  };

  // Function to navigate back
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to open search
  const handleSearch = () => {
    console.log('Open search');
  };

  // Function to render each call item
  const renderCallItem = ({ item }) => (
    <View style={styles.callItem}>
      <Image source={{ uri: item.image }} style={styles.callerImage} />
      
      <View style={styles.callDetails}>
        <Text style={[styles.callerName, item.isIncoming && styles.incomingText]}>
          {item.name}
        </Text>
        <View style={styles.statusRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        {item.status ? (
          <Text style={styles.callStatus}>{item.status}</Text>
        ) : null}
      </View>
      
      <TouchableOpacity style={styles.documentIcon}>
        <Text style={styles.docIcon}>📄</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with tabs */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={handleChatScreen}
        >
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Call</Text>
        </TouchableOpacity>
      </View>
      
      {/* Call history list */}
      <FlatList
        data={callHistory}
        renderItem={renderCallItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.callList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 18,
    color: '#888888',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FFFFFF',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    backgroundColor: '#333333',
  },
  callList: {
    paddingTop: 10,
  },
  callItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333333',
    alignItems: 'center',
  },
  callerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  callDetails: {
    flex: 1,
  },
  callerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  incomingText: {
    color: '#FF6B6B', // Highlight for incoming calls
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkmark: {
    color: '#4CD964',
    marginRight: 5,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 14,
    color: '#888888',
  },
  callStatus: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  documentIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIcon: {
    fontSize: 24,
    color: '#888888',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export default CallsScreen; 