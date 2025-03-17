import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const chatProfiles = [
  { id: '1', name: 'Profile 1', lastMessage: 'Hello there!', lastTexted: '10:30 AM', imageUrl: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Profile 2', lastMessage: 'How are you?', lastTexted: 'Yesterday', imageUrl: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Profile 3', lastMessage: 'See you soon!', lastTexted: '2 days ago', imageUrl: 'https://via.placeholder.com/50' },
  // Add more profiles as needed
];

const callHistory = [
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
];

const MessagingScreen = ({ navigation, route }) => {

  const phoneNumber = route.params?.phoneNumber
  // Initialize activeTab based on route params if available
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'Chat');
  
  // Function to handle navigation back
  const handleBack = () => {
    // We need to get a phoneNumber for ProfileScreen
    // Since we don't have it directly, we'll navigate to PhoneAuthScreen as a fallback
    // or you can set a default phone number here
    navigation.navigate('ProfileScreen', { phoneNumber: phoneNumber });
  };

  // Function to open search
  const handleSearch = () => {
    console.log('Open search');
  };

  // Function to render each chat item
  const renderChatItem = ({ item, index }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ChatProfileScreen', { profile: item })} 
      style={styles.chatItem}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
          <MaterialIcons name="chat" size={24} color="white" style={styles.chatIcon} />
        </View>
        <View>
          <Text style={styles.profileName}>{item.name}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
      </View>
      <Text style={styles.timeStamp}>{item.lastTexted}</Text>
    </TouchableOpacity>
  );

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
          <Text style={styles.callTimestamp}>{item.timestamp}</Text>
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
      
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <View style={styles.backButtonInner}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.dividerLine} />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'Chat' && styles.activeTab
          ]}
          onPress={() => setActiveTab('Chat')}
        >
          <MaterialIcons name="chat" size={24} color="white" style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'Chat' && styles.activeTabText]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'Calls' && styles.activeTab
          ]}
          onPress={() => setActiveTab('Calls')}
        >
          <MaterialIcons name="call" size={24} color="white" style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'Calls' && styles.activeTabText]}>Calls</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content based on active tab */}
      {activeTab === 'Chat' ? (
        <FlatList
          data={chatProfiles}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={callHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderCallItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {/* Bottom search button for Calls tab */}
      {activeTab === 'Calls' && (
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backButton: {
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    padding: 8,
    borderRadius: 4,
  },
  backButtonInner: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 18,
    color: 'black',
  },
  dividerLine: {
    height: 2,
    backgroundColor: 'white',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0,
    borderBottomColor: 'white',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabIcon: {
    marginRight: 5,
  },
  tabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  listContent: {
    paddingTop: 10,
  },
  
  // Chat styles
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    borderWidth: 0,
    borderColor: 'white',
  },
  chatIcon: {
    position: 'absolute',
    top: 13,
    left: 13,
  },
  profileName: {
    fontSize: 18,
    color: 'white',
  },
  lastMessage: {
    fontSize: 14,
    color: 'white',
  },
  timeStamp: {
    fontSize: 12,
    color: 'white',
  },
  
  // Call styles
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
    color: '#FF6B6B',
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
  callTimestamp: {
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
  searchButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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

export default MessagingScreen;
