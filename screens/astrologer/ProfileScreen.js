import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch
} from 'react-native';
import api from '../../services/api';

const ProfileScreen = ({route, navigation }) => {

  const { phoneNumber } = route.params;


  // State for online/offline status
  const [chatStatus, setChatStatus] = useState(true); // offline by default
  const [callStatus, setCallStatus] = useState(true); // online by default
  const [balance, setBalance] = useState(10000); // 10K balance
  const [profile, setProfile] = useState([]);

  // Function to update status on the server
  const updateStatusOnServer = async (chat_value,call_value)=> {
    try {

      const response = await api.post('/update_call_status', {
        phoneNumber,
        chat_status: chat_value ? 1: 0,
        call_status: call_value ? 1: 0
      });
      console.log('Status updated successfully:', response.data);
      await fetchProfile();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Watch for changes in chat or call status
    // useEffect(() => {
    //   updateStatusOnServer(chatStatus, callStatus);
    // }, [chatStatus, callStatus]);

    const handleToogle = async(value,type)=>{


      let call_value = callStatus
      let chat_value = chatStatus
      if(type=="chat"){
        setChatStatus(value);
        chat_value = value
      }else{
        setCallStatus(value);
        call_value = value
      }

      await updateStatusOnServer(chat_value,call_value);
      
    }

  // Function to handle viewing all transactions
  const handleViewTransactions = () => {
    console.log('View all transactions');
    // navigation.navigate('TransactionsScreen');
  };

  // Function to view more details about a package
  const handleViewPackage = (packageId) => {
    console.log(`View more details for package ${packageId}`);
    // navigation.navigate('PackageDetailScreen', { packageId });
  };

  // Function to navigate back
  const handleBack = () => {
    navigation.goBack();
  };

  // Function to navigate to calls screen
  const handleCallsScreen = () => {
    console.log('Navigate to calls screen');
    // navigation.navigate('CallsScreen');
  };

  // Function to navigate to chats screen
  const handleChatsScreen = () => {
    console.log('Navigate to chats screen');
    // navigation.navigate('ChatsScreen');
  };

  // Function to edit profile
  const handleEditProfile = () => {
    console.log('Edit profile');
    // navigation.navigate('EditProfileScreen');
  };

  const fetchProfile = async () => {
      try {
        const response = await api.post('/get-profile',{phoneNumber});
        const data = response?.data?.data;
        setProfile(data);
        setChatStatus( data?.chat_status ? true : false);
        setCallStatus( data?.call_status ? true : false);
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);
  

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Top section with user profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: profile?.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{profile?.fullName || "Name"}</Text>
              <Text style={styles.specialization}>{profile?.practiceAreas || "Specialization" }</Text>
              <Text style={styles.languages}>{profile?.languages?.length > 0 ? profile?.languages?.join(', ') : 'None'}</Text>
              <Text style={styles.experience}>exp: {profile?.experience || "Experience"} years</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>

          {/* Current Status Section */}
          <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>Current Status</Text>
            <Text style={styles.statusDescription}>
              change you online status for call and chat to receive user queries
            </Text>

            {/* Chat Status Toggle */}
            <View style={styles.statusToggle}>
              <View style={styles.statusType}>
                <Text style={styles.statusIcon}>💬</Text>
                <Text style={styles.statusLabel}>chat</Text>
              </View>
              <View style={styles.toggleContainer}>
                <Text style={styles.statusIndicator}>
                  {chatStatus ? 'online' : 'offline'}
                </Text>
                <Switch
                  value={chatStatus}
                  onValueChange={(value) => {
                    handleToogle(value,"chat")
                  }}
                  trackColor={{ false: '#767577', true: '#4CD964' }}
                  thumbColor={'#f4f3f4'}
                />
              </View>
            </View>

            {/* Call Status Toggle */}
            <View style={styles.statusToggle}>
              <View style={styles.statusType}>
                <Text style={styles.statusIcon}>📞</Text>
                <Text style={styles.statusLabel}>call</Text>
              </View>
              <View style={styles.toggleContainer}>
                <Text style={styles.statusIndicator}>
                  {callStatus ? 'online' : 'offline'}
                </Text>
                <Switch
                  value={callStatus}
                  onValueChange={(value) => {
                    handleToogle(value,"call")
                  }}
                  trackColor={{ false: '#767577', true: '#4CD964' }}
                  thumbColor={'#f4f3f4'}
                />
              </View>
            </View>

            {/* View Transactions Button */}
            <TouchableOpacity
              style={styles.transactionsButton}
              onPress={handleViewTransactions}
            >
              <Text style={styles.transactionsText}>View all transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Packages Section */}
        <View style={styles.packagesSection}>
          <Text style={styles.packagesTitle}>Packages</Text>
          <Text style={styles.packagesDescription}>
            Select current packages to receive more customer calls and chat
          </Text>

          <View style={styles.packageCards}>
            {/* Package 1 */}
            <View style={[styles.packageCard, styles.packageGreen]}>
              <View style={styles.packageContent}>
                <Text style={styles.packageTitle}>package 1</Text>
                <Text style={styles.packageDescription}>
                  talk to experts doctors related to health, medicines
                </Text>
                <Image
                  source={{ uri: 'https://placehold.co/100x100/4CAF50/FFFFFF.png?text=P1' }}
                  style={styles.packageImage}
                />
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => handleViewPackage(1)}
                >
                  <Text style={styles.moreButtonText}>more</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Package 2 */}
            <View style={[styles.packageCard, styles.packageDark]}>
              <View style={styles.packageContent}>
                <Text style={styles.packageTitle}>package 2</Text>
                <Text style={styles.packageDescription}>
                  talk to experts doctors related to health, medicines
                </Text>
                <Image
                  source={{ uri: 'https://placehold.co/100x100/333333/FFFFFF.png?text=P2' }}
                  style={styles.packageImage}
                />
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => handleViewPackage(2)}
                >
                  <Text style={styles.moreButtonText}>more</Text>
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Text style={styles.navIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>BALANCE</Text>
          <Text style={styles.balanceAmount}>₹ {balance/1000}K</Text>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={handleCallsScreen}>
          <Text style={styles.navIcon}>📞</Text>
          <Text style={styles.navLabel}>Calls</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleChatsScreen}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Chats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  profileSection: {
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00CED1',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  specialization: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 5,
  },
  languages: {
    fontSize: 14,
    color: '#888888',
  },
  experience: {
    fontSize: 14,
    color: '#888888',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  statusSection: {
    marginTop: 20,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statusDescription: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 20,
  },
  statusToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statusType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  statusLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    fontSize: 16,
    color: '#AAAAAA',
    marginRight: 10,
  },
  transactionsButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  transactionsText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  packagesSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  packagesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  packagesDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  packageCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  packageGreen: {
    backgroundColor: '#0D5D3A',
  },
  packageDark: {
    backgroundColor: '#333333',
  },
  packageContent: {
    padding: 15,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  packageDescription: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 15,
  },
  packageImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  moreButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  moreButtonText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 5,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#000000',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  navIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  balanceContainer: {
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 10,
    color: '#AAAAAA',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProfileScreen;