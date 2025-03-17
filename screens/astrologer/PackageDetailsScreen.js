import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PackageDetailsScreen = ({ route, navigation }) => {
  const { packageId, phoneNumber } = route.params;

  // Dummy package data - in a real app, you would fetch this from an API
  const packageData = {
    title: "Slab Pricing",
    description: "talk to experts doctors related to health, medicines talk to experts doctors related to health, medicinestalk to experts doctors related to health, medicines",
    termsOfUse: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat magna vitae elementum pulvinar. Suspendisse ultrices mauris ac odio sodales ultricies. Etiam",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat magna vitae elementum pulvinar. Suspendisse ultrices mauris ac odio sodales ultricies. Etiam",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat magna vitae elementum pulvinar. Suspendisse ultrices mauris ac odio sodales ultricies. Etiam"
    ]
  };

  const handleActivate = () => {
    // Here you would call an API to activate the package
    console.log(`Activating package ${packageId}`);
    alert('The package will be immediately activated');
    // Navigate back to profile screen after activation
    navigation.navigate('ProfileScreen', { phoneNumber });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <Text style={styles.title}>{packageData.title}</Text>
        
        <View style={styles.divider} />
        
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{packageData.description}</Text>
        </View>
        
        <View style={styles.divider} />
        
        {/* Terms of Use Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms of Use</Text>
          {packageData.termsOfUse.map((term, index) => (
            <Text key={index} style={styles.sectionText}>{term}</Text>
          ))}
        </View>
      </ScrollView>
      
      {/* Bottom Action Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.activateButton}
          onPress={handleActivate}
        >
          <Text style={styles.activateButtonText}>Activate</Text>
          <MaterialIcons name="arrow-forward" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.activateNote}>the package will be immediately activated</Text>
      </View>
      
      {/* Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MessagingScreen', { initialTab: 'Calls' })}>
          <MaterialIcons name="call" size={24} color="white" />
          <Text style={styles.navLabel}>Calls</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MessagingScreen', { initialTab: 'Chat' })}>
          <MaterialIcons name="chat" size={24} color="white" />
          <Text style={styles.navLabel}>Chats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  activateButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
  },
  activateNote: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 5,
  },
});

export default PackageDetailsScreen; 