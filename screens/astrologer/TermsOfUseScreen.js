// screens/TermsScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

const TermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: March 12, 2025</Text>
        
        <Text style={styles.introText}>
          Please read these Terms of Use ("Terms", "Terms of Use") carefully before using the Way2Expert mobile application and website (the "Service") operated by Way2Expert ("us", "we", or "our").
        </Text>
        
        <Text style={styles.introText}>
          Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
        </Text>
        
        <Text style={styles.introText}>
          By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </Text>
        
        <Text style={styles.sectionTitle}>1. ACCOUNTS</Text>
        <Text style={styles.paragraph}>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </Text>
        <Text style={styles.paragraph}>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </Text>
        <Text style={styles.paragraph}>
          You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </Text>
        
        <Text style={styles.sectionTitle}>2. PROFESSIONAL SERVICES</Text>
        <Text style={styles.paragraph}>
          Way2Expert is a platform that connects users with professionals in various fields. We do not provide professional services directly. The professionals on our platform are independent providers and not our employees or agents.
        </Text>
        <Text style={styles.paragraph}>
          We do not endorse, guarantee, or take responsibility for the quality, accuracy, or reliability of any professional services provided through our platform.
        </Text>
        <Text style={styles.paragraph}>
          You acknowledge that any reliance on the professional services obtained through our platform is at your own risk.
        </Text>
        
        <Text style={styles.sectionTitle}>3. USER CONTENT</Text>
        <Text style={styles.paragraph}>
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
        </Text>
        <Text style={styles.paragraph}>
          By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
        </Text>
        
        <Text style={styles.sectionTitle}>4. PAYMENTS</Text>
        <Text style={styles.paragraph}>
          You agree to pay all fees or charges to your account based on the fee structure in effect at the time the fee or charge is due and payable. You are responsible for paying for all services ordered through your account.
        </Text>
        <Text style={styles.paragraph}>
          Payment for services must be made by the methods specified within the Service. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service.
        </Text>
        
        <Text style={styles.sectionTitle}>5. TERMINATION</Text>
        <Text style={styles.paragraph}>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </Text>
        <Text style={styles.paragraph}>
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to deactivate your account.
        </Text>
        
        <Text style={styles.sectionTitle}>6. LIMITATION OF LIABILITY</Text>
        <Text style={styles.paragraph}>
          In no event shall Way2Expert, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </Text>
        
        <Text style={styles.sectionTitle}>7. CHANGES</Text>
        <Text style={styles.paragraph}>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Text>
        <Text style={styles.paragraph}>
          By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
        </Text>
        
        <Text style={styles.sectionTitle}>8. GOVERNING LAW</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        </Text>
        <Text style={styles.paragraph}>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </Text>
        
        <Text style={styles.sectionTitle}>9. CONTACT US</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us:
        </Text>
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>By email: terms@way2expert.com</Text>
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
    marginBottom: 20,
  },
  introText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
    fontStyle: 'italic',
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

export default TermsScreen;