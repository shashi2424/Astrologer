import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import api from '../../services/api';

function ProfessionDocScreen({  route,navigation }) {
  
  const {phoneNumber,fullName,description,languages,profileImage} = route.params;

  // Add refs for input fields
  const sessionChargeRef = useRef(null);
  const experienceRef = useRef(null);
  const practiceAreasRef = useRef(null);
  const panNumberRef = useRef(null);

  const [sessionCharge, setSessionCharge] = useState('');
  const [experience, setExperience] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panError, setPanError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [upi_id,setUpiId] = useState('');
  const [certificate_url,setCertificate_url] = useState('');

  const validatePanNumber = (pan) => {
    // PAN format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handlePanChange = (text) => {
    const upperText = text.toUpperCase();
    setPanNumber(upperText);
    if (text.length > 0 && !validatePanNumber(upperText)) {
      setPanError('Invalid PAN format. Format should be: ABCDE1234F');
      setErrors({...errors, panNumber: true});
    } else {
      setPanError('');
      const newErrors = {...errors};
      delete newErrors.panNumber;
      setErrors(newErrors);
    }
  };

  const handleSessionChargeChange = (text) => {
    // Allow only digits and clear if not a valid number
    const numericValue = text.replace(/[^0-9]/g, '');
    setSessionCharge(numericValue);
    
    // Set or clear error as needed
    if (!numericValue || numericValue === '') {
      setErrors({...errors, sessionCharge: true});
    } else {
      const newErrors = {...errors};
      delete newErrors.sessionCharge;
      setErrors(newErrors);
    }
  };

  const handleExperienceChange = (text) => {
    // Allow only digits and clear if not a valid number
    const numericValue = text.replace(/[^0-9]/g, '');
    setExperience(numericValue);
    
    // Set or clear error as needed
    if (!numericValue || numericValue === '') {
      setErrors({...errors, experience: true});
    } else {
      const newErrors = {...errors};
      delete newErrors.experience;
      setErrors(newErrors);
    }
  };

  const handlePracticeAreasChange = (text) => {
    setPracticeAreas(text);
  };

  const pickImage = async () => {
    // If there's already a certificate, show an alert
    if (certificates.length > 0) {
      Alert.alert(
        'Certificate Already Uploaded',
        'You can only upload one certificate. Do you want to replace the existing one?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Replace',
            onPress: () => showFileSourceOptions(),
          },
        ]
      );
      return;
    }
    
    showFileSourceOptions();
  };
  
  const showFileSourceOptions = async () => {
    // Request permission for camera and media library
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and media library access is needed to upload documents.');
      return;
    }

    // Show action sheet for file source selection
    Alert.alert(
      'Select File Source',
      'Choose where you want to pick the file from',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              const imageUri = result.assets[0].uri;
              setCertificates([imageUri]); // Replace any existing certificate
              
              // Clear certificate error if exists
              const newErrors = {...errors};
              delete newErrors.certificate;
              setErrors(newErrors);
              
              // Upload the certificate image
              uploadImage(imageUri);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both images and documents
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              const fileUri = result.assets[0].uri;
              setCertificates([fileUri]); // Replace any existing certificate
              
              // Clear certificate error if exists
              const newErrors = {...errors};
              delete newErrors.certificate;
              setErrors(newErrors);
              
              // Upload the file
              uploadImage(fileUri);
            }
          },
        },
        {
          text: 'Documents',
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
              });
              
              if (result.canceled === false && result.assets && result.assets.length > 0) {
                const fileUri = result.assets[0].uri;
                setCertificates([fileUri]); // Replace any existing certificate
                
                // Clear certificate error if exists
                const newErrors = {...errors};
                delete newErrors.certificate;
                setErrors(newErrors);
                
                // Upload the document
                uploadImage(fileUri);
              }
            } catch (error) {
              console.log('Error picking document:', error);
              Alert.alert('Error', 'Failed to pick document. Please try again.');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  
  // Function to upload image to server
  const uploadImage = async (imageUri) => {
    try {
      // Create form data
      const formData = new FormData();
      
      // Get the file name from the URI
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      
      // Determine file type based on file extension
      const fileExtension = fileName.split('.').pop().toLowerCase();
      let fileType;
      
      // Set appropriate MIME type based on file extension
      if (fileExtension === 'pdf') {
        fileType = 'application/pdf';
      } else if (['jpg', 'jpeg'].includes(fileExtension)) {
        fileType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        fileType = 'image/png';
      } else if (fileExtension === 'gif') {
        fileType = 'image/gif';
      } else if (fileExtension === 'heic') {
        fileType = 'image/heic';
      } else {
        // Default to jpeg if extension not recognized
        fileType = 'image/jpeg';
      }
      
      // Append the file to the form data with field name 'image' to match Node.js API
      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type: fileType
      });
      
      // Configure axios request with correct headers
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      };
      
      // Make POST request to upload endpoint using the api instance
      const response = await api.post('/upload', formData, config);
      setCertificate_url(response?.data?.image_url);
      console.log('File upload success:', response.data);
      // You can store the response URL or handle success as needed
    } catch (error) {
      console.error('File upload failed:', error);
      Alert.alert('Upload Failed', 'Failed to upload file. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate PAN number
    if (!panNumber) {
      newErrors.panNumber = true;
    } else if (!validatePanNumber(panNumber)) {
      newErrors.panNumber = true;
    }
    
    // Validate session charge
    if (!sessionCharge) {
      newErrors.sessionCharge = true;
    }
    
    // Validate experience
    if (!experience) {
      newErrors.experience = true;
    }
    
    // Validate certificates
    if (certificates.length === 0) {
      newErrors.certificate = true;
    }

    if (!upi_id) {
      newErrors.upiId = true;
    }
    
    setErrors(newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all the required fields and upload a certificate.');
      return;
    }

    try {
      setIsSubmitting(true);
      await SaveProfile()
      // Simple navigation without params
      navigation.navigate('AwaitingVerficationScreen');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while submitting your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const SaveProfile = async () => {
    try {
      const response = await api.post('save-profile',{
      phoneNumber,
      fullName,
      description,
      languages,
      profileImage,
      certificate_url,
      panNumber,
      sessionCharge,
      experience,
      practiceAreas,
      upi_id
    });
    console.log(response.data,"------------>save Profile Data")
      
    } catch (error) {

      console.log(error)
      throw error;

    }
  }
    

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Professional Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN Number <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.input, (panError || errors.panNumber) ? styles.inputError : null]}
            value={panNumber}
            onChangeText={handlePanChange}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            autoCapitalize="characters"
            maxLength={10}
            ref={panNumberRef}
          />
          {panError ? <Text style={styles.errorText}>{panError}</Text> : null}
          {errors.panNumber && !panError ? <Text style={styles.errorText}>PAN number is required</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Charge (per minute) <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.sessionCharge ? styles.inputError : null]}
            value={sessionCharge}
            onChangeText={handleSessionChargeChange}
            placeholder="Enter charge per minute"
            keyboardType="number-pad"
            returnKeyType="done"
            ref={sessionChargeRef}
          />
          {errors.sessionCharge ? <Text style={styles.errorText}>Session charge is required</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years of Experience <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.experience ? styles.inputError : null]}
            value={experience}
            onChangeText={handleExperienceChange}
            placeholder="Enter years of experience"
            keyboardType="number-pad"
            returnKeyType="done"
            ref={experienceRef}
          />
          {errors.experience ? <Text style={styles.errorText}>Years of experience is required</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Practice Areas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={practiceAreas}
            onChangeText={handlePracticeAreasChange}
            placeholder="Enter your practice areas (e.g., Vedic Astrology, Numerology)"
            multiline
            numberOfLines={4}
            ref={practiceAreasRef}
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>UPI ID <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.upiId ? styles.inputError : null]}
            value={upi_id}
            onChangeText={(text) => {
              setUpiId(text);
              // UPI ID format validation
              const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
              if (text && !upiRegex.test(text)) {
                setErrors({...errors, upiId: true});
              } else {
                const newErrors = {...errors};
                delete newErrors.upiId;
                setErrors(newErrors);
              }
            }}
            placeholder="Enter your UPI ID (e.g. name@bank)"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.upiId && <Text style={styles.errorText}>Please enter a valid UPI ID</Text>}
        </View>

        <View style={styles.verifyButtonContainer}>
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => {
              if (!upi_id) {
                Alert.alert('Please enter UPI ID first');
                return;
              }
              // TODO: Add UPI verification logic here
              Alert.alert('UPI Verification', 'UPI verification feature coming soon');
            }}
          >
            <Text style={styles.verifyButtonText}>Verify UPI</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.certificatesContainer}>
          <Text style={styles.label}>Certificate <Text style={styles.requiredStar}>*</Text></Text>
          <TouchableOpacity 
            style={[styles.uploadButton, errors.certificate ? styles.uploadButtonError : null]} 
            onPress={pickImage}
          >
            <Ionicons name="cloud-upload-outline" size={24} color={errors.certificate ? Colors.error : Colors.primary} />
            <Text style={[styles.uploadButtonText, errors.certificate ? styles.uploadButtonTextError : null]}>
              Upload Certificate, PDF or Document
            </Text>
          </TouchableOpacity>
          {errors.certificate ? <Text style={styles.errorText}>Certificate is required</Text> : null}

          <View style={styles.certificatesList}>
            {certificates.map((uri, index) => {
              // Determine if it's a PDF file
              const isPdf = uri.toLowerCase().endsWith('.pdf');
              
              return (
                <View key={index} style={styles.certificateItem}>
                  {isPdf ? (
                    <View style={styles.pdfPreview}>
                      <Ionicons name="document-text" size={40} color={Colors.primary} />
                      <Text style={styles.pdfText}>PDF</Text>
                    </View>
                  ) : (
                    <Image source={{ uri }} style={styles.certificateImage} />
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      setCertificates([]);
                      setErrors({...errors, certificate: true});
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  requiredStar: {
    color: Colors.error,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  certificatesContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    marginBottom: 15,
  },
  uploadButtonError: {
    borderColor: Colors.error,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primary,
  },
  uploadButtonTextError: {
    color: Colors.error,
  },
  certificatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  certificateItem: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  certificateImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  },
  pdfPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  pdfText: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default ProfessionDocScreen;