// screens/ProfessionScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';

const ProfessionScreen = ({ navigation, route }) => {
  const { phoneNumber, verificationId } = route.params || {};
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  // Add a ref for controlling focus and preventing blinking
  const initialRenderRef = React.useRef(true);
  
  // useEffect to prevent screen blinking on navigation
  React.useEffect(() => {
    // Skip initial render animation
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
  }, []);
  
  const handleBack = () => {
    navigation.navigate('PhoneAuthScreen');
  };
  
  const handleNext = () => {
    if (!fullName) {
      // Show validation error (could be an Alert, but using inline validation for this example)
      return;
    }
    navigation.navigate('ProfessionDocScreen')
    // Navigate to next screen with user data
    // navigation.navigate('PaymentScreen', {
    //   phoneNumber,
    //   fullName,
    //   description,
    //   profession: selectedProfession
    // });
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
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.profilePreview}>
          <Text style={styles.previewName}>
            {fullName || 'full name'}
          </Text>
          <Text style={styles.previewOccupation}>
            OCCUPATION
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.nextButton,
            (!fullName) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!fullName}
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
    marginBottom: 25,
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
  // Occupation styles
  occupationSection: {
    marginTop: 10,
  },
  professionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -5,
    marginRight: -5,
  },
  professionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  selectedProfession: {
    backgroundColor: '#00C853',
    borderColor: '#00C853',
  },
  professionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedProfessionText: {
    color: '#000000',
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
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewOccupation: {
    color: '#888888',
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 4,
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
  }
});

export default ProfessionScreen;