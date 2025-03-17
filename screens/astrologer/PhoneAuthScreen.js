import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  TouchableWithoutFeedback,
  Alert 
} from 'react-native';
import { validatePhoneNumber } from '../../utils/helpers';
import { Button } from '../../components/Button';
import api from "../../services/api"

const PhoneAuthScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContinue = async () => {
    if (!isChecked) {
      Alert.alert('Terms Required', 'Please confirm your country code and agree to terms');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number');
      return;
    }
    
    try {
      setIsLoading(true);
      // Call API to send verification code
      const response = await sendVerificationCode(phoneNumber);
      // Navigate to verification screen with the phone number
      if(parseInt(response?.success_code)==1){
        navigation.navigate('VerificationScreen', { 
          phoneNumber
        });
      }
      else{
        Alert.alert(response?.message)
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async(phnumber)=>{
    try {
    data ={"mobile": phnumber}
    console.log(data,"-------------->data")
    const response = await api.post('/send-otp',data);
    console.log(response?.data)
    return response?.data
  } catch (error) {
    throw error;
  }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>LOGIN</Text>
          <Text style={styles.title}>Tell us your mobile number</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="9652791013"
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox} 
            onPress={() => setIsChecked(!isChecked)}
          >
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.termsText}>
            Please confirm your country code and enter your{' '}
            <Text style={styles.phoneText}>phone number</Text>
          </Text>
        </View>
        
        <Button 
          title="Agree & Continue"
          onPress={handleContinue}
          isLoading={isLoading}
          disabled={!phoneNumber || isLoading}
        />
        
        <Text style={styles.policyText}>
          By proceeding, you are indicating that you have read and agree to our{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('TermsScreen')}>
            terms of use
          </Text>
          {' & '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyScreen')}>
            privacy policy
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  termsText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  phoneText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  policyText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#3498db',
  },
});

export default PhoneAuthScreen;