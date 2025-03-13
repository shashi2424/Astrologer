import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Dimensions, TouchableOpacity, Platform, ActionSheetIOS } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PROFILE_PIC_KEY = 'profilePicUri';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const [profilePic, setProfilePic] = useState(null);
  const [description, setDescription] = useState('');
  const [sessionPrice, setSessionPrice] = useState('');

  const handleProfilePicChange = async () => {
    if (Platform.OS === 'ios') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        alert('Sorry, we need camera and media library permissions to make this work!');
        return;
      }

      const options = ['Take Photo', 'Choose from Gallery', 'Cancel'];
      const cancelButtonIndex = 2;

      const response = await new Promise((resolve) => {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            resolve(buttonIndex);
          }
        );
      });

      let result;
      if (response === 0) {
        // Take Photo
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else if (response === 1) {
        // Choose from Gallery
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: [ImagePicker.MediaType.IMAGE],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (result && !result.cancelled) {
        const uri = result.uri;
        if (uri) {
          setProfilePic({ uri });
          saveProfilePic(uri);
        }
      }
    } else {
      // Android logic
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result && !result.cancelled) {
        const uri = result.uri;
        if (uri) {
          setProfilePic({ uri });
          saveProfilePic(uri);
        }
      }
    }
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
  };

  const handleSessionPriceChange = (text) => {
    setSessionPrice(text);
  };

  const handleSaveChanges = () => {
    // Logic to save changes
    navigation.goBack(); // Navigate back to the previous page
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const loadProfilePic = async () => {
    try {
      const uri = await AsyncStorage.getItem(PROFILE_PIC_KEY);
      if (uri !== null) {
        setProfilePic({ uri });
      }
    } catch (error) {
      console.error('Failed to load profile picture:', error);
    }
  };

  const saveProfilePic = async (uri) => {
    try {
      await AsyncStorage.setItem(PROFILE_PIC_KEY, uri);
    } catch (error) {
      console.error('Failed to save profile picture:', error);
    }
  };

  useEffect(() => {
    requestPermissions();
    loadProfilePic();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Edit Profile</Text>
        <TouchableOpacity onPress={handleProfilePicChange} style={styles.profilePicContainer}>
          {profilePic ? (
            <Image source={profilePic} style={styles.profilePic} />
          ) : (
            <Text style={styles.plusSymbol}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={handleDescriptionChange}
        placeholder="Enter your description"
        placeholderTextColor="#ffffff"
      />

      <Text style={styles.text}>Session Price</Text>
      <TextInput
        style={styles.input}
        value={sessionPrice}
        onChangeText={handleSessionPriceChange}
        placeholder="Enter session price"
        placeholderTextColor="#ffffff"
        keyboardType="numeric"
      />

      <Button title="Save Changes" onPress={handleSaveChanges} style={styles.saveButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderColor: '#ffffff',
    borderWidth: 2,
    marginTop: 20,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.25) / 2,
  },
  plusSymbol: {
    fontSize: 24,
    color: '#ffffff',
  },
  descriptionInput: {
    height: height * 0.15,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#ffffff',
    marginTop: 20,
  },
  input: {
    height: height * 0.05,
    borderColor: '#ffffff',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#ffffff',
    marginTop: 20,
  },
  text: {
    color: '#ffffff',
  },
  saveButton: {
    marginTop: 20,
  },
});

export default ProfileEditScreen;
