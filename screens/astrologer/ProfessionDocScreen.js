import React, { useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

function ProfessionDocScreen({ navigation }) {
  const [sessionCharge, setSessionCharge] = useState('');
  const [experience, setExperience] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [panError, setPanError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } else {
      setPanError('');
    }
  };

  const pickImage = async () => {
    // Request permission for camera and media library
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and media library access is needed to upload documents.');
      return;
    }

    // Show action sheet for image source selection
    Alert.alert(
      'Select Image Source',
      'Choose where you want to pick the image from',
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
              setCertificates([...certificates, result.assets[0].uri]);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setCertificates([...certificates, result.assets[0].uri]);
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

  const handleSubmit = async () => {
    // Validate form
    if (!sessionCharge || !experience || !practiceAreas || certificates.length === 0 || !panNumber) {
      Alert.alert('Error', 'Please fill all the required fields and upload at least one certificate.');
      return;
    }

    if (!validatePanNumber(panNumber)) {
      Alert.alert('Error', 'Please enter a valid PAN number.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Simple navigation without params
      navigation.navigate('AwaitingVerficationScreen');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while submitting your details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Professional Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>PAN Number</Text>
          <TextInput
            style={[styles.input, panError ? styles.inputError : null]}
            value={panNumber}
            onChangeText={handlePanChange}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            autoCapitalize="characters"
            maxLength={10}
          />
          {panError ? <Text style={styles.errorText}>{panError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Session Charge (per minute)</Text>
          <TextInput
            style={styles.input}
            value={sessionCharge}
            onChangeText={setSessionCharge}
            placeholder="Enter charge per minute"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            placeholder="Enter years of experience"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Practice Areas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={practiceAreas}
            onChangeText={setPracticeAreas}
            placeholder="Enter your practice areas (e.g., Vedic Astrology, Numerology)"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.certificatesContainer}>
          <Text style={styles.label}>Certificates & Documents</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Upload Certificate</Text>
          </TouchableOpacity>

          <View style={styles.certificatesList}>
            {certificates.map((uri, index) => (
              <View key={index} style={styles.certificateItem}>
                <Image source={{ uri }} style={styles.certificateImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const newCertificates = certificates.filter((_, i) => i !== index);
                    setCertificates(newCertificates);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
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
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primary,
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
});

export default ProfessionDocScreen;