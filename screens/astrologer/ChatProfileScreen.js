import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Animated, ActionSheetIOS, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Sample chat messages for demonstration
const initialMessages = [
  { id: '1', text: 'Hello there!', sender: 'them', timestamp: '10:30 AM' },
  { id: '2', text: 'Hi! How can I help you today?', sender: 'me', timestamp: '10:31 AM' },
  { id: '3', text: 'I was wondering about my horoscope for this week.', sender: 'them', timestamp: '10:32 AM' },
  { id: '4', text: 'Sure, I can help with that. What\'s your zodiac sign?', sender: 'me', timestamp: '10:33 AM' },
  { id: '5', text: 'I\'m a Taurus.', sender: 'them', timestamp: '10:34 AM' },
  { id: '6', text: 'Great! As a Taurus this week, you should focus on financial planning and personal relationships. Venus is in a favorable position.', sender: 'me', timestamp: '10:36 AM' },
];

const ChatProfileScreen = ({ route, navigation }) => {
  const { profile } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Request permission for camera and media library
  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera and media library access is needed to use this feature');
      }
    })();
  }, []);

  // Simulate "typing" animation
  useEffect(() => {
    let typingTimeout;
    if (messages.length > 0 && messages[messages.length - 1].sender === 'me') {
      setIsTyping(true);
      typingTimeout = setTimeout(() => {
        const response = {
          id: Date.now().toString(),
          text: "That's interesting! Tell me more about what you see in the stars for me.",
          sender: 'them',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 3000);
    }

    return () => clearTimeout(typingTimeout);
  }, [messages]);

  // Animate typing indicator
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const showAttachmentOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Take Photo
            handleCamera();
          } else if (buttonIndex === 2) {
            // Choose from Gallery
            handleGallery();
          }
        }
      );
    } else {
      // For Android
      Alert.alert(
        'Send Image',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: handleCamera },
          { text: 'Choose from Gallery', onPress: handleGallery },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        sendImageMessage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take a photo');
      console.error(error);
    }
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        sendImageMessage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image from gallery');
      console.error(error);
    }
  };

  const sendImageMessage = (imageUri) => {
    const newMessage = {
      id: Date.now().toString(),
      image: imageUri,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    
    // Scroll to the bottom after sending a message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to the bottom after sending a message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle navigation to MessagingScreen with chat tab active
  const handleChatNavigation = () => {
    navigation.navigate('MessagingScreen', { 
      initialTab: 'Chat',
      profile: profile
    });
  };

  // Handle navigation to MessagingScreen with calls tab active
  const handleCallsNavigation = () => {
    navigation.navigate('MessagingScreen', { 
      initialTab: 'Calls',
      profile: profile
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('MessagingScreen', { initialTab: 'Chat' })} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
            <View style={[styles.statusIndicator, { backgroundColor: 'green' }]} />
          </View>
          <View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.endButton} 
          onPress={() => {
            try {
              // Navigate to chat end popup
              navigation.navigate('ChatEndProfile', {
                profile: profile,
                callDuration: '2 Minutes 44 seconds'
              });
            } catch (error) {
              // Log any errors that occur during navigation
              console.error('Navigation error:', error);
              Alert.alert('Error', 'Failed to end call. Please try again.');
            }
          }}
        >
          <MaterialIcons name="call-end" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Debug Navigation Test Button - Remove in production */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => {
          Alert.alert(
            'Test Navigation',
            'Choose navigation method',
            [
              {
                text: 'Navigate',
                onPress: () => navigation.navigate('ChatEndProfile', {
                  profile,
                  callDuration: '1 Minutes 30 seconds (test)'
                })
              },
              {
                text: 'Reset Navigation',
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{ 
                    name: 'ChatEndProfile', 
                    params: {
                      profile,
                      callDuration: '1 Minutes 30 seconds (test)'
                    } 
                  }],
                })
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      >
        {/* <Text style={styles.testButtonText}>Test End Call Navigation</Text> */}
      </TouchableOpacity>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.theirMessage
          ]}>
            {item.text && <Text style={styles.messageText}>{item.text}</Text>}
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{profile.name} is typing</Text>
          <Animated.View style={[
            styles.typingDot,
            { opacity: typingAnimation }
          ]} />
        </View>
      )}

      {/* Message Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachButton} onPress={showAttachmentOptions}>
          <MaterialIcons name="attach-file" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
        />
        {message.trim().length > 0 ? (
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <MaterialIcons name="send" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <MaterialIcons name="mic" size={24} color="white" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>

      {/* <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleChatNavigation}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="chat" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCallsNavigation}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="call" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
      </View> */}

      <TouchableOpacity 
        style={styles.infoContainer}
        onPress={() => {
          // Navigate to ChatEndProfileScreen with transaction details
          navigation.navigate('ChatEndProfile', {
            profile: profile,
            callDuration: '15 minutes'
          });
        }}
      >
        {/* <Text style={styles.infoTitle}>Last Conversation</Text>
        <Text style={styles.infoText}>{profile.lastMessage}</Text>
        <Text style={styles.timeStamp}>{profile.lastTexted}</Text> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'black',
  },
  profileName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineStatus: {
    color: '#8a8a8a',
    fontSize: 14,
  },
  endButton: {
    backgroundColor: 'red',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084FF',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingText: {
    color: '#8a8a8a',
    fontSize: 14,
    marginRight: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8a8a8a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  attachButton: {
    padding: 8,
    marginRight: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 20,
    padding: 12,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0084FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    backgroundColor: '#0084FF',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  testButton: {
    backgroundColor: '#555',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#333',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  timeStamp: {
    fontSize: 14,
    color: '#888',
  },
});

export default ChatProfileScreen;
