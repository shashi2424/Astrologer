import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
// import api from '../../services/api'; // Not needed for static design

const EarningPageScreen = ({  route,navigation }) => {
  const { phoneNumber } = route.params || {};

  console.log(phoneNumber,"---------------->Phone Number")
  
  // State for earnings data
  const [received, setReceived] = useState(0);
  const [pending, setPending] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load static data when component mounts
  useEffect(() => {
    // Simulate loading for UI testing
    setTimeout(() => {
      loadStaticData();
    }, 1000);
  }, []);

  // Function to load static mock data
  const loadStaticData = () => {
    setIsLoading(true);
    
    // Set static data values
    setReceived(30043);
    setPending(30043);
    setTransactions(mockTransactions());
    
    setIsLoading(false);
  };

  // Function to handle viewing all transactions
  const handleViewAllTransactions = () => {
    // Navigate to a detailed transactions view, or expand the current view
    navigation.navigate('AllTransactionsScreen', { phoneNumber });
  };

  // Function to go back
  const handleBack = () => {
    navigation.goBack();
  };

  // Group transactions by month-year
  const groupTransactionsByMonth = () => {
    const grouped = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      const monthYear = `${getMonthName(date.getMonth())} ${date.getFullYear()}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(transaction);
    });
    
    return grouped;
  };
  
  // Helper function to get month name
  const getMonthName = (monthIndex) => {
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];
    return months[monthIndex];
  };
  
  // Format the transaction date
  const formatTransactionDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = getMonthName(date.getMonth()).toLowerCase();
    const year = date.getFullYear().toString().substr(-2);
    
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes}${ampm}, ${day}th ${month}'${year}`;
  };

  // Render transaction groups
  const renderTransactionGroups = () => {
    const groupedTransactions = groupTransactionsByMonth();
    
    return Object.keys(groupedTransactions).map(monthYear => (
      <View key={monthYear} style={styles.transactionGroup}>
        <Text style={styles.monthHeader}>{monthYear}</Text>
        {groupedTransactions[monthYear].map((transaction, index) => (
          <View key={`${transaction.id || index}`} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <Image 
                source={{ uri: transaction.userImage || 'https://placehold.co/100x100' }} 
                style={styles.userImage} 
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{transaction.userName}</Text>
                <View style={styles.timestampContainer}>
                  {transaction.type === 'chat' ? (
                    <Text style={[styles.statusDot, styles.greenDot]}>●</Text>
                  ) : (
                    <Text style={[styles.statusDot, styles.blueDot]}>●</Text>
                  )}
                  <Text style={styles.timestamp}>{formatTransactionDate(transaction.timestamp)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={styles.amount}>₹{transaction.amount}</Text>
              <Text style={styles.detailsArrow}>›</Text>
            </View>
          </View>
        ))}
      </View>
    ));
  };

  // Mock data for testing UI
  const mockTransactions = () => {
    const transactions = [
      {
        id: 1,
        userName: 'Fatima',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-06-16T16:50:00',
        type: 'chat',
        status: 'completed'
      },
      {
        id: 2,
        userName: 'Prasad',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-06-16T16:50:00',
        type: 'chat',
        status: 'completed'
      },
      {
        id: 3,
        userName: 'Vishwajeet',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-06-16T16:50:00',
        type: 'call',
        status: 'completed'
      },
      {
        id: 4,
        userName: 'Ram Narayan',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-06-16T16:50:00',
        type: 'call',
        status: 'completed'
      },
      {
        id: 5,
        userName: 'Prasad',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-05-16T16:50:00',
        type: 'chat',
        status: 'completed'
      },
      {
        id: 6,
        userName: 'Ram Narayan',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-05-16T16:50:00',
        type: 'call',
        status: 'completed'
      },
      {
        id: 7,
        userName: 'Prasad',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-05-16T16:50:00',
        type: 'chat',
        status: 'completed'
      },
      {
        id: 8,
        userName: 'Dr. Ram Narayan',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-05-16T16:50:00',
        type: 'call',
        status: 'completed'
      },
      {
        id: 9,
        userName: 'Dr. Ram Narayan',
        userImage: 'https://placehold.co/100x100',
        amount: 50,
        timestamp: '2023-05-16T16:50:00',
        type: 'call',
        status: 'completed'
      }
    ];
    
    return transactions;
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadStaticData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {/* Balance Section */}
          <View style={styles.balanceSection}>
     
              <Image 
                source={require('../../assets/money.png')} 
                style={styles.moneyIcon}
                defaultSource={{ uri: 'https://placehold.co/100x100/4CAF50/FFFFFF.png?text=₹' }}
              />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <Text style={styles.statDot}>●</Text>
                  <Text style={styles.statLabel}>RECEIVED</Text>
                </View>
                <Text style={styles.statAmount}>Rs. {received}</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <Text style={[styles.statDot, styles.pendingDot]}>●</Text>
                  <Text style={styles.statLabel}>PENDING</Text>
                </View>
                <Text style={styles.statAmount}>Rs. {pending}</Text>
              </View>
            </View>
            
            <Text style={styles.pendingNote}>
              pending amount will be credit with in 7 days
            </Text>
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={handleViewAllTransactions}
            >
              <Text style={styles.viewAllText}>View all transactions</Text>
            </TouchableOpacity>
          </View>
          
          {/* Transactions List */}
          <View style={styles.transactionsContainer}>
            {renderTransactionGroups()}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  balanceSection: {
    padding: 20,
  },
  balanceLabel: {
    color: '#aaaaaa',
    fontSize: 18,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  moneyIcon: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  statItem: {
    marginRight: 30,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    color: '#4CD964',
    fontSize: 16,
    marginRight: 5,
  },
  pendingDot: {
    color: '#ff9500',
  },
  statLabel: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  statAmount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingNote: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 15,
  },
  viewAllButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  viewAllText: {
    color: '#ffffff',
    fontSize: 14,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
  },
  transactionGroup: {
    marginBottom: 20,
  },
  monthHeader: {
    color: '#aaaaaa',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    marginRight: 5,
    fontSize: 14,
  },
  greenDot: {
    color: '#4CD964',
  },
  blueDot: {
    color: '#007bff',
  },
  timestamp: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  detailsArrow: {
    color: '#aaaaaa',
    fontSize: 20,
  }
});

export default EarningPageScreen; 