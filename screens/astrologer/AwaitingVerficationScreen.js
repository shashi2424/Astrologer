import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

function AwaitingVerificationScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="hourglass-outline" size={100} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Under Review</Text>
        
        <View style={styles.card}>
          <Text style={styles.heading}>Your Application is Being Processed!</Text>
          {/* <Text style={styles.description}>
            Thank you for choosing to be a part of our expert community. Our team is carefully reviewing:
          </Text> */}
          
          {/* <View style={styles.checklistContainer}>
            <View style={styles.checklistItem}>
              <Ionicons name="documents-outline" size={24} color={Colors.secondary} />
              <Text style={styles.checklistText}>Professional Certificates</Text>
            </View>
            <View style={styles.checklistItem}>
              <Ionicons name="card-outline" size={24} color={Colors.secondary} />
              <Text style={styles.checklistText}>PAN Card Verification</Text>
            </View>
            <View style={styles.checklistItem}>
              <Ionicons name="briefcase-outline" size={24} color={Colors.secondary} />
              <Text style={styles.checklistText}>{8} Years Experience</Text>
            </View>
            <View style={styles.checklistItem}>
              <Ionicons name="star-outline" size={24} color={Colors.secondary} />
              <Text style={styles.checklistText}>Expertise Areas</Text>
            </View>
          </View> */}

          <View style={styles.timelineContainer}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.activeDot]} />
              <Text style={styles.timelineText}>Documents Submitted</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.activeDot]} />
              <Text style={styles.timelineText}>Under Review</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <Text style={[styles.timelineText, styles.pendingText]}>Verification Complete</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Our team typically completes the verification within 24-48 hours. You'll receive a notification once approved.
          </Text>

          <View style={styles.statusContainer}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} />
            <Text style={styles.statusText}>Status: Verification in Progress</Text>
          </View>
        </View>

        <View style={styles.supportCard}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.secondary} />
          <Text style={styles.supportTitle}>Need Help?</Text>
          {/* <Text style={styles.supportText}>
            Our support team is available 24/7 to assist you with any queries during the verification process.
          </Text> */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: 30,
    padding: 25,
    borderRadius: 60,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    marginVertical: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  checklistContainer: {
    marginVertical: 20,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 15,
    borderRadius: 12,
  },
  checklistText: {
    marginLeft: 15,
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  timelineContainer: {
    marginVertical: 30,
    width: '100%',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textSecondary,
    marginRight: 15,
  },
  activeDot: {
    backgroundColor: Colors.secondary,
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.textSecondary,
    marginLeft: 5,
  },
  timelineText: {
    fontSize: 16,
    color: Colors.text,
  },
  pendingText: {
    color: Colors.textSecondary,
  },
  note: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 20,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  supportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
    marginVertical: 10,
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AwaitingVerificationScreen; 