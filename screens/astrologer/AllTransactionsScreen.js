import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView
} from 'react-native';
// import api from '../../services/api'; // Not needed for static design

const AllTransactionsScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params || {};
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'chat', 'call'
  const [filterDate, setFilterDate] = useState('all'); // 'all', 'today', 'week', 'month', 'year'

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
    
    const mockData = mockTransactions();
    setTransactions(mockData);
    setFilteredTransactions(mockData);
    
    setIsLoading(false);
  };

  // Function to go back
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to filter transactions
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction => 
        transaction.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }
    
    // Apply date filter
    if (filterDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (filterDate === 'today') {
        filtered = filtered.filter(transaction => {
          const txDate = new Date(transaction.timestamp);
          return txDate >= today;
        });
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        filtered = filtered.filter(transaction => {
          const txDate = new Date(transaction.timestamp);
          return txDate >= weekAgo;
        });
      } else if (filterDate === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        filtered = filtered.filter(transaction => {
          const txDate = new Date(transaction.timestamp);
          return txDate >= monthAgo;
        });
      } else if (filterDate === 'year') {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        
        filtered = filtered.filter(transaction => {
          const txDate = new Date(transaction.timestamp);
          return txDate >= yearAgo;
        });
      }
    }
    
    // Update filtered transactions
    setFilteredTransactions(filtered);
  }, [searchQuery, filterType, filterDate, transactions]);

  // Format the transaction date
  const formatTransactionDate = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const year = date.getFullYear().toString().substr(-2);
    
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes}${ampm}, ${day}th ${month}'${year}`;
  };

  // Mock data for testing
  const mockTransactions = () => {
    // Generate 50 mock transactions
    const types = ['chat', 'call'];
    const names = ['Fatima', 'Prasad', 'Vishwajeet', 'Ram Narayan', 'Dr. Ram Narayan', 'Ayushi'];
    const transactions = [];
    
    for (let i = 0; i < 50; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365)); // Random date in the last year
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      // Generate random duration between 5 and 60 minutes
      const randomDuration = Math.floor(Math.random() * 56) + 5;
      
      // Generate random amount between 100 and 2000
      const randomAmount = Math.floor(Math.random() * 1901) + 100;
      
      // Format amount with comma for thousands
      const formattedAmount = randomAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      // Generate order ID
      const orderId = `#${Math.floor(Math.random() * 10000000000000)}`;
      
      transactions.push({
        id: i + 1,
        userName: randomName,
        userImage: 'https://placehold.co/100x100',
        amount: formattedAmount,
        timestamp: randomDate.toISOString(),
        type: randomType,
        status: Math.random() > 0.2 ? 'completed' : 'pending',
        duration: `${randomDuration} minutes`,
        orderId: orderId
      });
    }
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Render a transaction item
  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => navigation.navigate('PersonTransactionScreen', { transaction: item })}
    >
      <View style={styles.transactionLeft}>
        <Image 
          source={{ uri: item.userImage || 'https://placehold.co/100x100' }} 
          style={styles.userImage} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <View style={styles.timestampContainer}>
            {item.type === 'chat' ? (
              <Text style={[styles.statusDot, styles.greenDot]}>●</Text>
            ) : (
              <Text style={[styles.statusDot, styles.blueDot]}>●</Text>
            )}
            <Text style={styles.timestamp}>{formatTransactionDate(item.timestamp)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        {item.status === 'pending' && (
          <Text style={styles.pendingText}>pending</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#777"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'chat' && styles.activeFilter]}
            onPress={() => setFilterType('chat')}
          >
            <Text style={[styles.filterText, filterType === 'chat' && styles.activeFilterText]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterType === 'call' && styles.activeFilter]}
            onPress={() => setFilterType('call')}
          >
            <Text style={[styles.filterText, filterType === 'call' && styles.activeFilterText]}>Call</Text>
          </TouchableOpacity>

          <View style={styles.filterDivider} />

          <TouchableOpacity 
            style={[styles.filterButton, filterDate === 'all' && styles.activeFilter]}
            onPress={() => setFilterDate('all')}
          >
            <Text style={[styles.filterText, filterDate === 'all' && styles.activeFilterText]}>All Time</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterDate === 'today' && styles.activeFilter]}
            onPress={() => setFilterDate('today')}
          >
            <Text style={[styles.filterText, filterDate === 'today' && styles.activeFilterText]}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterDate === 'week' && styles.activeFilter]}
            onPress={() => setFilterDate('week')}
          >
            <Text style={[styles.filterText, filterDate === 'week' && styles.activeFilterText]}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterDate === 'month' && styles.activeFilter]}
            onPress={() => setFilterDate('month')}
          >
            <Text style={[styles.filterText, filterDate === 'month' && styles.activeFilterText]}>This Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filterDate === 'year' && styles.activeFilter]}
            onPress={() => setFilterDate('year')}
          >
            <Text style={[styles.filterText, filterDate === 'year' && styles.activeFilterText]}>This Year</Text>
          </TouchableOpacity>
        </ScrollView>
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
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => `transaction-${item.id}`}
          contentContainerStyle={styles.transactionList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          }
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    height: 60,
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#222',
  },
  activeFilter: {
    backgroundColor: '#4CD964',
  },
  filterText: {
    color: '#aaa',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#000',
    fontWeight: 'bold',
  },
  filterDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#444',
    alignSelf: 'center',
    marginHorizontal: 5,
  },
  transactionList: {
    paddingHorizontal: 20,
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
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  amount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#ff9500',
    fontSize: 12,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
  }
});

export default AllTransactionsScreen; 