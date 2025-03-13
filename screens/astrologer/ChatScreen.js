import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const profiles = [
  { id: '1', name: 'Profile 1', lastMessage: 'Hello there!', lastTexted: '10:30 AM', imageUrl: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Profile 2', lastMessage: 'How are you?', lastTexted: 'Yesterday', imageUrl: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Profile 3', lastMessage: 'See you soon!', lastTexted: '2 days ago', imageUrl: 'https://via.placeholder.com/50' },
  // Add more profiles as needed
];

const ChatScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Chat');
  
  // Function to handle navigation to CallsScreen
  const handleCallsNavigation = () => {
    // Navigate to CallsScreen
    navigation.navigate('CallsScreen');
  };
  
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'black' }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16, marginBottom: 8, padding: 8, borderRadius: 4 }}>
        <View style={{ backgroundColor: 'white', padding: 4, borderRadius: 4 }}>
          <Text style={{ fontSize: 18, color: 'black' }}>{'< Back'}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 2, backgroundColor: 'white', marginBottom: 16 }} />

      {/* Tab Navigation */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            alignItems: 'center', 
            paddingVertical: 10, 
            borderBottomWidth: activeTab === 'Chat' ? 2 : 0, 
            borderBottomColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
          onPress={() => setActiveTab('Chat')}
        >
          <MaterialIcons name="chat" size={24} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: activeTab === 'Chat' ? 'bold' : 'normal' }}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ 
            flex: 1, 
            alignItems: 'center', 
            paddingVertical: 10, 
            borderBottomWidth: activeTab === 'Calls' ? 2 : 0, 
            borderBottomColor: 'white',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
          onPress={handleCallsNavigation}
        >
          <MaterialIcons name="call" size={24} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: activeTab === 'Calls' ? 'bold' : 'normal' }}>Calls</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'Chat' ? (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('ChatProfileScreen', { profile: item })} 
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: item.imageUrl }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16, borderWidth: index === profiles.length - 1 ? 2 : 0, borderColor: 'white' }} />
                  <MaterialIcons name="chat" size={24} color="white" style={{ position: 'absolute', top: 13, left: 13 }} />
                </View>
                <View>
                  <Text style={{ fontSize: 18, color: 'white' }}>{item.name}</Text>
                  <Text style={{ fontSize: 14, color: 'white' }}>{item.lastMessage}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: 'white' }}>{item.lastTexted}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16 }}>Redirecting to Calls Screen...</Text>
        </View>
      )}
    </View>
  );
};

export default ChatScreen;
