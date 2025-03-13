import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity 
} from 'react-native';

import { Button } from '../../components/Button';
import api from "../../services/api"


const VerificationScreen = ({ route, navigation }) => {

  const { phoneNumber } = route.params;
  
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);
  
  const handleVerification = async () => {
    if (code.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter the 4-digit verification code');
      return;
    }
    
    try {
      // setIsLoading(true);
      console.log("Inside verification screen")
      // navigation.navigate('ProfessionScreen');
      // Verify the code
      const resp = await verifyCode(phoneNumber, code);
      if(parseInt(resp?.success_code)==1){
        Alert.alert('Success', 'OTP Verified successfully');

        if(parseInt(resp?.profile_status)==0){
          navigation.navigate('ProfessionScreen',{ 
            phoneNumber
          });
        }else{
         if(parseInt(resp?.is_verified)==1){
          navigation.navigate('ProfileScreen',{ 
            phoneNumber
          });
         }else{
          navigation.navigate('ProfileScreen',{ 
            phoneNumber
          });
         }
        }

      }
    
      else{
        Alert.alert(resp?.message|| "Something Went wrong");
        return;
      }
      
      // Navigate to the main app or profile setup
      // navigation.navigate('ProfileSetupScreen');
    } catch (error) {
      console.log(error,"------------------_>handleVerification error")
      Alert.alert('Verification Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (phoneNumber,code)=>{
  try {
    data ={"mobile": phoneNumber,"otp":code}
    const response = await api.post('/verify-otp',data);
    console.log(response?.data,"-------------------->response")
    return response?.data
  } catch (error) {
    console.log(error,"---------------------->Verify code error")
    throw error;
  }
  }

    const resendVerificationCode = async(phoneNumber)=>{
    try {
    data ={"mobile": phoneNumber}
    const response = await api.post('/send-otp',data);
  } catch (error) {
    throw error;
  }
  }
  
  const handleResendCode = async () => {
    try {
      setIsResending(true);
      // Resend verification code
      await resendVerificationCode(phoneNumber);
      setTimer(60);
      Alert.alert('Success', 'Verification code resent successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LOGIN</Text>
        <Text style={styles.title}>We sent you a code to verify</Text>
        <Text style={styles.subtitle}>to {phoneNumber}</Text>
      </View>
      
      <View style={styles.codeContainer}>
        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={4}
          placeholder="Enter 4-digit code"
          placeholderTextColor="#555555"
        />
      </View>
      
      <Button
        title="Verify"
        onPress={handleVerification}
        isLoading={isLoading}
        disabled={code.length !== 4 || isLoading}
      />
      
      <View style={styles.resendContainer}>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend code in {timer} secs</Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode} disabled={isResending}>
            <Text style={styles.resendText}>
              I didn't receive a code
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  codeContainer: {
    marginBottom: 30,
  },
  codeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: '#111111',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  timerText: {
    color: '#888888',
    fontSize: 14,
  },
  resendText: {
    color: '#3498db',
    fontSize: 14,
  },
});

export default VerificationScreen;