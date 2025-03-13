// screens/ProfessionScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';

const ProfessionScreen = ({ navigation, route }) => {
  const { phoneNumber, verificationId } = route.params || {};
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Add a ref for controlling focus and preventing blinking
  const initialRenderRef = React.useRef(true);
  
  // useLayoutEffect instead of useEffect to prevent flashing
  // This runs synchronously before browser paint
  useLayoutEffect(() => {
    // Skip initial render animation
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // Short timeout to ensure component is fully mounted
      setTimeout(() => {
        setIsReady(true);
      }, 50);
    }
  }, []);

  // Request permission for accessing media library
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (galleryStatus.status !== 'granted') {
          alert('Sorry, we need camera roll permissions to upload a profile picture!');
        }
      }
    })();
  }, []);
  
  const handleBack = () => {
    navigation.navigate('PhoneAuthScreen');
  };
  
  const handleNext = () => {
    if (!fullName) {
      // Show validation error (could be an Alert, but using inline validation for this example)
      return;
    }
    if(!profileImage){
      Alert.alert('Please upload profile image')
      return;
    }
    if(selectedLanguages.length === 0){
      Alert.alert('Please Select atleast one language')
      return;
    }
    
    // Navigate to next screen with user data including profile image
    navigation.navigate('ProfessionDocScreen', {
      phoneNumber,
      fullName,
      description,
      languages: selectedLanguages,
      profileImage
    });
  };
  
  const openLanguageModal = () => {
    setShowLanguageModal(true);
  };
  
  const closeLanguageModal = () => {
    setShowLanguageModal(false);
  };
  
  const toggleLanguage = (language) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  // Show image source selection modal
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  
  // Image picker function for selecting from gallery
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // setProfileImage(result.assets[0].uri);
      
      // Upload image to server
      uploadProfileImage(result.assets[0].uri);
    }
    setShowImageSourceModal(false);
  };
  
  // Image picker function for using camera
  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to take a profile picture!');
      setShowImageSourceModal(false);
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // setProfileImage(result.assets[0].uri);
      
      // Upload image to server
      uploadProfileImage(result.assets[0].uri);
    }
    setShowImageSourceModal(false);
  };
  
  // Function to upload profile image to server
 // Function to upload profile image to server
  // Function to upload profile image to server
  const uploadProfileImage = async (imageUri) => {
    try {
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
      
      // Log what we're trying to upload
      console.log('Uploading image:', {
        uri: imageUri,
        name: fileName,
        type: mimeType
      });
      
      // Prepare file object - this is critical for Multer to recognize
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
        setProfileImage(response?.data?.image_url);
        console.log('Profile image updated to:', response?.data?.image_url);
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
        console.error('Error headers:', error.response.headers);
        
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
    }
  };
  
  // Function to show image source options
  const showImageOptions = () => {
    setShowImageSourceModal(true);
  };

  const languages = [
    { id: 1, name: 'Telugu' },
    { id: 2, name: 'Tamil' },
    { id: 3, name: 'Kannada' },
    { id: 4, name: 'Hindi' },
    { id: 5, name: 'Bengali' },
    { id: 6, name: 'Gujarathi' },
    { id: 7, name: 'Malayalam' },
    { id: 8, name: 'Marathi' },
  ];
  
  // Don't render anything until ready
  if (!isReady) {
    return (
      <View style={styles.container}>
        {/* Empty view while loading to prevent flash */}
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>WELCOME TO WAY2EXPERT</Text>
          <Text style={styles.title}>Tell about your Profession</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '33%' }]} />
            </View>
            <Text style={styles.progressText}>1/3</Text>
          </View>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.profilePicSection}>
          <TouchableOpacity 
            style={styles.profilePicContainer}
            onPress={showImageOptions}
          >
            {profileImage ? (
              <View style={styles.profilePicWrapper}>
                <Image 
                  source={{ uri: profileImage }} 
                  style={styles.profilePic} 
                />
                {/* <View style={styles.editIconContainer}>
                  <Text style={styles.editIconText}>✎</Text>
                </View> */}
              </View>
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <Text style={styles.profilePicIcon}>+</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profilePicText}>
            {profileImage ? 'Profile Picture' : 'Add profile picture'}
          </Text>
        </View>
        
        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="full name"
              placeholderTextColor="#888888"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about yourself in 60 words"
              placeholderTextColor="#888888"
              multiline
              numberOfLines={4}
              maxLength={300}
            />
          </View>
          
          {/* Language Selection Button */}
          <TouchableOpacity 
            style={styles.languageSelectionButton}
            onPress={openLanguageModal}
          >
            <View style={styles.languageButtonContent}>
              <View style={styles.globeIconContainer}>
                <Text style={styles.globeIcon}>⊕</Text>
              </View>
              <View style={styles.languageTextContainer}>
                <Text style={styles.languageTitle}>Add Languages</Text>
                <Text style={styles.languageSubtitle}>select your known languages</Text>
              </View>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>

          {/* Show selected languages if any */}
          {selectedLanguages.length > 0 && (
            <View style={styles.selectedLanguagesContainer}>
              <Text style={styles.selectedLanguagesLabel}>Selected Languages:</Text>
              <Text style={styles.selectedLanguagesText}>
                {selectedLanguages.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Language Selection Modal */}
      {showLanguageModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Languages</Text>
              <TouchableOpacity onPress={closeLanguageModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.languageGrid}>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.id}
                  style={[
                    styles.languageButton,
                    selectedLanguages.includes(language.name) && styles.selectedLanguageButton
                  ]}
                  onPress={() => toggleLanguage(language.name)}
                >
                  {selectedLanguages.includes(language.name) ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : (
                    <Text style={styles.plusIcon}>+</Text>
                  )}
                  <Text 
                    style={[
                      styles.languageButtonText,
                      selectedLanguages.includes(language.name) && styles.selectedLanguageText
                    ]}
                  >
                    {language.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.saveLanguagesButton} 
              onPress={closeLanguageModal}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Image Source Selection Modal */}
      {showImageSourceModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, styles.imageSourceModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowImageSourceModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageOptionsContainer}>
              <TouchableOpacity 
                style={styles.imageOptionButton} 
                onPress={takePhoto}
              >
                <View style={styles.imageOptionIconContainer}>
                  <Text style={styles.imageOptionIcon}>📷</Text>
                </View>
                <Text style={styles.imageOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.imageOptionButton} 
                onPress={pickImageFromGallery}
              >
                <View style={styles.imageOptionIconContainer}>
                  <Text style={styles.imageOptionIcon}>🖼️</Text>
                </View>
                <Text style={styles.imageOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              {profileImage && (
                <TouchableOpacity 
                  style={[styles.imageOptionButton, styles.removeImageButton]} 
                  onPress={() => {
                    setProfileImage(null);
                    setShowImageSourceModal(false);
                  }}
                >
                  <View style={styles.imageOptionIconContainer}>
                    <Text style={styles.imageOptionIcon}>🗑️</Text>
                  </View>
                  <Text style={styles.imageOptionText}>Remove Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      
      {/* Footer - only render when component is fully ready */}
      <View style={styles.footer}>
        <View style={styles.profilePreview}>
          {profileImage ? (
            <View style={styles.profilePreviewWithImage}>
              <Image 
                source={{ uri: profileImage }} 
                style={styles.previewProfilePic} 
              />
              <Text style={styles.previewName}>
                {fullName || 'full name'}
              </Text>
            </View>
          ) : (
            <Text style={styles.previewName}>
              {fullName || 'full name'}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!fullName || !profileImage) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!fullName && !profileImage}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Text style={styles.aboutYouText}>ABOUT YOU</Text>
          <Text style={styles.nextArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginRight: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  // Profile Picture Section
  profilePicSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00C853',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  profilePicWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#00C853',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  editIconText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profilePicPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicIcon: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  profilePicText: {
    color: '#00C853',
    fontSize: 14,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#111111',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  // Language Selection Button
  languageSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  languageButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  globeIconContainer: {
    marginRight: 15,
  },
  globeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  languageTextContainer: {
    flexDirection: 'column',
  },
  languageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 2,
  },
  languageSubtitle: {
    color: '#888888',
    fontSize: 12,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  // Selected languages display
  selectedLanguagesContainer: {
    marginBottom: 25,
    paddingVertical: 10,
  },
  selectedLanguagesLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
  },
  selectedLanguagesText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  // Footer Styles
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  profilePreview: {
    flex: 1,
    justifyContent: 'center',
  },
  profilePreviewWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    borderColor: '#555555',
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 5,
  },
  aboutYouText: {
    color: '#888888',
    fontSize: 10,
  },
  nextArrow: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 5,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#111111',
    borderRadius: 8,
    width: '85%',
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  selectedLanguageButton: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  checkIcon: {
    marginRight: 5,
    color: '#000000',
    fontSize: 16,
  },
  plusIcon: {
    marginRight: 5,
    color: '#FFFFFF',
    fontSize: 16,
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedLanguageText: {
    color: '#000000',
  },
  saveLanguagesButton: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Image Source Modal styles
  imageSourceModal: {
    paddingVertical: 25,
  },
  imageOptionsContainer: {
    width: '100%',
  },
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  imageOptionIconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  imageOptionIcon: {
    fontSize: 24,
  },
  imageOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  removeImageButton: {
    marginTop: 10,
    borderBottomWidth: 0,
  }
});

export default ProfessionScreen;