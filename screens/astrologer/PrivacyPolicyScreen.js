// screens/PrivacyScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const PrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: March 12, 2025</Text>
        
        <Text style={styles.sectionTitle}>1. INTRODUCTION</Text>
        <Text style={styles.paragraph}>
          Welcome to Way2Expert. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our platform and tell you about your privacy rights and how the law protects you.
        </Text>
        
        <Text style={styles.sectionTitle}>2. DATA WE COLLECT</Text>
        <Text style={styles.paragraph}>
          We collect several different types of information for various purposes to provide and improve our Service to you:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Personal Information: Name, email address, phone number, profession</Text>
          <Text style={styles.bulletItem}>• Usage Data: How you use our platform, services accessed</Text>
          <Text style={styles.bulletItem}>• Device Information: IP address, browser type, device type</Text>
          <Text style={styles.bulletItem}>• Location Data: General geographic location based on IP address</Text>
          <Text style={styles.bulletItem}>• Professional Information: Qualifications, specialties, experience</Text>
        </View>
        
        <Text style={styles.sectionTitle}>3. HOW WE USE YOUR DATA</Text>
        <Text style={styles.paragraph}>
          We use the collected data for various purposes:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• To provide and maintain our Service</Text>
          <Text style={styles.bulletItem}>• To notify you about changes to our Service</Text>
          <Text style={styles.bulletItem}>• To allow you to participate in interactive features</Text>
          <Text style={styles.bulletItem}>• To provide customer support</Text>
          <Text style={styles.bulletItem}>• To gather analysis or valuable information</Text>
          <Text style={styles.bulletItem}>• To monitor the usage of our Service</Text>
          <Text style={styles.bulletItem}>• To detect, prevent and address technical issues</Text>
        </View>
        
        <Text style={styles.sectionTitle}>4. DATA SECURITY</Text>
        <Text style={styles.paragraph}>
          The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </Text>
        
        <Text style={styles.sectionTitle}>5. YOUR RIGHTS</Text>
        <Text style={styles.paragraph}>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data:
        </Text>
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Request access to your personal data</Text>
          <Text style={styles.bulletItem}>• Request correction of your personal data</Text>
          <Text style={styles.bulletItem}>• Request erasure of your personal data</Text>
          <Text style={styles.bulletItem}>• Object to processing of your personal data</Text>
          <Text style={styles.bulletItem}>• Request restriction of processing your personal data</Text>
          <Text style={styles.bulletItem}>• Request transfer of your personal data</Text>
          <Text style={styles.bulletItem}>• Right to withdraw consent</Text>
        </View>
        
        <Text style={styles.sectionTitle}>6. THIRD-PARTY LINKS</Text>
        <Text style={styles.paragraph}>
          Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
        </Text>
        
        <Text style={styles.sectionTitle}>7. CHANGES TO THIS PRIVACY POLICY</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date at the top of this Privacy Policy.
        </Text>
        
        <Text style={styles.sectionTitle}>8. CONTACT US</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us:
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>By email: privacy@way2expert.com</Text>
          <Text style={styles.contactItem}>By phone: +91 9876543210</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Way2Expert. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40, // To offset the back button and center the title
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  paragraph: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
  bulletList: {
    marginLeft: 5,
    marginBottom: 20,
  },
  bulletItem: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  contactInfo: {
    marginTop: 10,
    marginBottom: 30,
  },
  contactItem: {
    color: '#3498db',
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#888888',
    fontSize: 12,
  },
});

export default PrivacyScreen;