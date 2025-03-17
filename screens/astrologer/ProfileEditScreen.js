import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

const ProfileEditScreen = ({ route,navigation }) => {
  const { phoneNumber, profile } = route.params || {};
  
  const [profilePic, setProfilePic] = useState(profile?.profileImage || null);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [description, setDescription] = useState(profile?.description || '');
  const [sessionPrice, setSessionPrice] = useState(profile?.sessionCharge?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions for camera and media library
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (galleryStatus.status !== 'granted') {
          Alert.alert('Permission Needed', 'Sorry, we need camera roll permissions to upload a profile picture!');
        }
        
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          Alert.alert('Permission Needed', 'Sorry, we need camera permissions to take a profile picture!');
        }
      }
    })();
  }, []);

  const handleProfilePicChange = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Change Profile Picture',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Gallery', onPress: pickImageFromGallery },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      // For Android, show a simpler choice
      Alert.alert(
        'Change Profile Picture',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Gallery', onPress: pickImageFromGallery },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  // Image picker function for selecting from gallery
  const pickImageFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Upload image to server
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };
  
  // Image picker function for using camera
  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Upload image to server
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Function to upload profile image to server
  const uploadProfileImage = async (imageUri) => {
    try {
      setIsLoading(true);
      // Create form data
      const formData = new FormData();
      
      // Get the file name from the URI
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Extract file extension
      const extension = imageUri.split('.').pop() || 'jpg';
      
      // Determine mime type based on extension
      let mimeType = 'image/jpeg'; // Default
      if (extension.toLowerCase() === 'png') {
        mimeType = 'image/png';
      } else if (extension.toLowerCase() === 'gif') {
        mimeType = 'image/gif';
      }
      
      // Prepare file object for Multer
      const fileObj = {
        uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
        name: fileName || `image.${extension}`,
        type: mimeType
      };
      
      // Append image to form-data with field name 'image' to match Multer
      formData.append('image', fileObj);
      
      // Make request with explicit Content-Type header
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [function (data) {
          // Don't touch the data
          return data;
        }],
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data && response.data.image_url) {
        setProfilePic(response.data.image_url);
        console.log('Profile image updated to:', response.data.image_url);
      } else {
        console.warn('Response did not contain image_url:', response.data);
        Alert.alert('Upload Issue', 'Server response did not include the expected image URL');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      
      // Enhanced error logging
      if (error.response) {
        // Server responded with error
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        Alert.alert(
          'Upload Failed', 
          `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
        );
      } else if (error.request) {
        // Request made but no response received
        console.error('No response received:', error.request);
        Alert.alert('Network Issue', 'No response received from server. Check your connection.');
      } else {
        // Request setup error
        console.error('Request error:', error.message);
        Alert.alert('Upload Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!fullName.trim()) {
        Alert.alert('Error', 'Please enter your full name');
        setIsLoading(false);
        return;
      }

      if(!sessionPrice.trim()){
        Alert.alert('Error', 'Please enter session price');
        setIsLoading(false);
        return;
      }
      
      // Prepare data to update
      const profileData = {
        phoneNumber,
        fullName,
        description,
        sessionCharge: sessionPrice ? parseInt(sessionPrice, 10) : 0,
        profileImage: profilePic
      };
      
      // Send update request to server
      const response = await api.post('/update-profile', profileData);
      
      if (response?.data) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('ProfileScreen',{ 
            phoneNumber
          });
      } else {
        Alert.alert('Error', response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to save profile changes:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>
        
        <View style={styles.profilePicSection}>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CD964" />
            </View>
          )}
          <TouchableOpacity onPress={handleProfilePicChange} style={styles.profilePicContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Text style={styles.plusSymbol}>+</Text>
                <Text style={styles.uploadText}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfilePicChange} style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Session Price (₹)</Text>
          <TextInput
            style={styles.input}
            value={sessionPrice}
            onChangeText={setSessionPrice}
            placeholder="Enter session price"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.disabledButton]} 
          onPress={handleSaveChanges}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profilePicSection: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (width * 0.3) / 2,
  },
  profilePicContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderColor: '#fff',
    borderWidth: 2,
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.3) / 2,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSymbol: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 5,
  },
  uploadText: {
    fontSize: 12,
    color: '#fff',
  },
  changePhotoButton: {
    marginTop: 10,
    padding: 5,
  },
  changePhotoText: {
    color: '#4CD964',
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    borderColor: '#444',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileEditScreen;
