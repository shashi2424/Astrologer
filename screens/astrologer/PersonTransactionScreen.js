import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const PersonTransactionScreen = ({ route, navigation }) => {
  const { transaction } = route.params || {};
  
  // Ensure we have a transaction object
  if (!transaction) {
    console.error('No transaction data provided');
  }
  
  // Format the timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][date.getMonth()];
    const year = date.getFullYear().toString().substr(-2);
    
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes}${ampm}, ${day}th ${month}'${year}`;
  };

  // Handle going back
  const handleBack = () => {
    navigation.goBack();
  };

  // Generate a random order ID if none exists
  const orderId = transaction?.orderId || `#${Math.floor(Math.random() * 10000000000000)}`;
  
  // Set duration (mock data)
  const duration = transaction?.duration || "15 minutes";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>transaction detail</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Total Amount Section */}
        <View style={styles.amountSection}>
          <View>
            <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.amountValue}>₹{transaction?.amount || '14,00.00'}</Text>
          </View>
          <View style={styles.sessionTypeContainer}>
            <View style={styles.sessionIconContainer}>
              {transaction?.type === 'call' ? (
                <Text style={styles.sessionIcon}>📞</Text>
              ) : (
                <Text style={styles.sessionIcon}>💬</Text>
              )}
            </View>
            <Text style={styles.sessionType}>{transaction?.type === 'call' ? 'Calls' : 'Chats'} Session</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* User Details Section */}
        <View style={styles.userSection}>
          <Image 
            source={{ uri: transaction?.userImage || 'https://placehold.co/100x100' }} 
            style={styles.userImage} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{transaction?.userName || 'Ayushi'}</Text>
            <View style={styles.timestampContainer}>
              <View style={styles.typeIconContainer}>
                {transaction?.type === 'call' ? (
                  <Text style={[styles.typeIcon, styles.blueIcon]}>📞</Text>
                ) : (
                  <Text style={[styles.typeIcon, styles.greenIcon]}>💬</Text>
                )}
              </View>
              <Text style={styles.timestamp}>{formatDate(transaction?.timestamp || '2023-06-16T16:50:00')}</Text>
            </View>
          </View>
        </View>

        {/* Order ID Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>order id</Text>
          <Text style={styles.detailValue}>{orderId}</Text>
        </View>

        {/* Duration Section */}
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>duration</Text>
          <Text style={styles.detailValue}>{duration}</Text>
        </View>
      </ScrollView>

      {/* Help Button */}
      <View style={styles.helpContainer}>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>Need Help?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 30,
    color: '#000',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  sessionTypeContainer: {
    alignItems: 'center',
  },
  sessionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionIcon: {
    fontSize: 24,
  },
  sessionType: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  typeIcon: {
    fontSize: 12,
    color: '#FFF',
  },
  greenIcon: {
    color: '#25D366',
  },
  blueIcon: {
    color: '#0088CC',
  },
  timestamp: {
    fontSize: 16,
    color: '#888',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  helpContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  helpButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default PersonTransactionScreen; 