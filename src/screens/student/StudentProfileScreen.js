import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../redux/slices/authSlice';
import { fetchUserProfile, updateProfile } from '../../redux/slices/userSlice';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS, SHADOWS } from '../../constants';
import ModernCard from '../../components/common/ModernCard';
import ModernInput from '../../components/common/ModernInput';
import ModernButton from '../../components/common/ModernButton';
import Badge from '../../components/common/Badge';

const StudentProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { user } = useSelector(state => state.auth);
  const { profile, isLoading } = useSelector(state => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', hostel: '', roomNumber: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try { await dispatch(fetchUserProfile(user?.id)).unwrap(); }
    catch (error) { console.error('Failed to load profile:', error); }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '', email: profile.email || '',
        phone: profile.phone || '', address: profile.address || '',
        hostel: profile.hostel || '', roomNumber: profile.roomNumber || '',
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Phone number is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) { Alert.alert('Error', 'Failed to update profile'); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => dispatch(logout()) },
    ]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const menuItems = [
    { icon: 'receipt-outline', title: 'Order History', subtitle: 'View all your past orders', screen: 'Orders' },
    { icon: 'card-outline', title: 'Payment Methods', subtitle: 'Manage payment options', action: () => Alert.alert('Coming Soon', 'Payment methods feature coming soon!') },
    { icon: 'location-outline', title: 'Delivery Addresses', subtitle: 'Manage delivery locations', action: () => Alert.alert('Coming Soon', 'Delivery addresses feature coming soon!') },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage notification settings', action: () => Alert.alert('Coming Soon', 'Notifications settings feature coming soon!') },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help with your orders', action: () => Alert.alert('Help & Support', 'For support, please contact: support@campusapp.com') },
  ];

return React.createElement(ScrollView, {
    style: [styles.container, { backgroundColor: colors.background }],
    contentContainerStyle: { paddingBottom: 60 },
    showsVerticalScrollIndicator: false,
  },
    // Header with avatar
    React.createElement(View, { style: [styles.header, { backgroundColor: colors.primary }] },
      React.createElement(View, { style: styles.avatarContainer },
        React.createElement(View, { style: [styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }] },
          React.createElement(Icon, { name: 'person', size: 48, color: '#FFFFFF' })
        ),
        React.createElement(View, { style: [styles.editAvatarBtn, { backgroundColor: colors.accent }] },
          React.createElement(Icon, { name: 'camera', size: 14, color: '#FFFFFF' })
        )
      ),
      React.createElement(Text, { style: styles.userName }, profile?.name || 'Student'),
      React.createElement(Text, { style: styles.userEmail }, profile?.email),
      React.createElement(Badge, {
        text: 'Student Account',
        variant: 'primary',
        style: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)' },
        textStyle: { color: '#FFFFFF' },
      })
    ),

    // Stats
    React.createElement(View, { style: styles.statsRow },
      React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS.xl,
        padding: 16,
        style: { flex: 1, marginRight: 8, alignItems: 'center' },
      },
        React.createElement(Text, { style: [styles.statValue, { color: colors.primary }] }, '0'),
        React.createElement(Text, { style: [styles.statLabel, { color: colors.gray }] }, 'Orders')
      ),
      React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS.xl,
        padding: 16,
        style: { flex: 1, marginHorizontal: 4, alignItems: 'center' },
      },
        React.createElement(Text, { style: [styles.statValue, { color: colors.accent }] }, '0'),
        React.createElement(Text, { style: [styles.statLabel, { color: colors.gray }] }, 'Completed')
      ),
      React.createElement(ModernCard, {
        variant: 'elevated',
        borderRadius: BORDER_RADIUS.xl,
        padding: 16,
        style: { flex: 1, marginLeft: 8, alignItems: 'center' },
      },
        React.createElement(Text, { style: [styles.statValue, { color: colors.warning }] }, 'PKR 0'),
        React.createElement(Text, { style: [styles.statLabel, { color: colors.gray }] }, 'Spent')
      )
    ),

    // Edit Form or Menu
    isEditing ? React.createElement(ModernCard, {
      variant: 'elevated',
      borderRadius: BORDER_RADIUS['2xl'],
      padding: 20,
      style: { marginHorizontal: 16, marginBottom: 16 },
    },
      React.createElement(Text, { style: [styles.sectionTitle, { color: colors.dark }] }, 'Edit Profile'),
      React.createElement(ModernInput, {
        label: 'Full Name',
        value: formData.name,
        onChangeText: (v) => handleInputChange('name', v),
        error: errors.name,
        leftIcon: 'person-outline',
      }),
      React.createElement(ModernInput, {
        label: 'Email',
        value: formData.email,
        editable: false,
        leftIcon: 'mail-outline',
      }),
      React.createElement(ModernInput, {
        label: 'Phone',
        value: formData.phone,
        onChangeText: (v) => handleInputChange('phone', v),
        keyboardType: 'phone-pad',
        error: errors.phone,
        leftIcon: 'call-outline',
      }),
      React.createElement(ModernInput, {
        label: 'Address',
        value: formData.address,
        onChangeText: (v) => handleInputChange('address', v),
        multiline: true,
        numberOfLines: 2,
        leftIcon: 'location-outline',
      }),
      React.createElement(ModernInput, {
        label: 'Hostel',
        value: formData.hostel,
        onChangeText: (v) => handleInputChange('hostel', v),
        leftIcon: 'home-outline',
      }),
      React.createElement(ModernInput, {
        label: 'Room Number',
        value: formData.roomNumber,
        onChangeText: (v) => handleInputChange('roomNumber', v),
        leftIcon: 'bed-outline',
      }),
      React.createElement(ModernButton, {
        title: 'Save Changes',
        onPress: handleUpdateProfile,
        loading: isLoading,
        fullWidth: true,
        style: { marginTop: 8 },
      }),
      React.createElement(ModernButton, {
        title: 'Cancel',
        onPress: () => setIsEditing(false),
        variant: 'outline',
        fullWidth: true,
        style: { marginTop: 8 },
      })
    ) : React.createElement(ModernCard, {
      variant: 'elevated',
      borderRadius: BORDER_RADIUS['2xl'],
      padding: 8,
      style: { marginHorizontal: 16, marginBottom: 16 },
    },
      menuItems.map((item, index) => React.createElement(TouchableOpacity, {
        key: index,
        onPress: item.screen ? () => navigation.navigate(item.screen) : item.action,
        style: [styles.menuItem, index < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.light }],
      },
        React.createElement(View, { style: [styles.menuIcon, { backgroundColor: colors.primaryMuted }] },
          React.createElement(Icon, { name: item.icon, size: 20, color: colors.primary })
        ),
        React.createElement(View, { style: styles.menuContent },
          React.createElement(Text, { style: [styles.menuTitle, { color: colors.dark }] }, item.title),
          React.createElement(Text, { style: [styles.menuSubtitle, { color: colors.gray }] }, item.subtitle)
        ),
        React.createElement(Icon, { name: 'chevron-forward', size: 18, color: colors.grayLight })
      ))
    ),

    // Actions
    React.createElement(View, { style: { paddingHorizontal: 16, paddingBottom: 32 } },
      !isEditing && React.createElement(ModernButton, {
        title: 'Edit Profile',
        onPress: () => setIsEditing(true),
        variant: 'outline',
        fullWidth: true,
        style: { marginBottom: 12 },
      }),
      React.createElement(ModernButton, {
        title: 'Logout',
        onPress: handleLogout,
        variant: 'danger',
        fullWidth: true,
      })
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  userName: { fontSize: FONTS.h2.size, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  userEmail: { fontSize: FONTS.bodySmall.size, color: 'rgba(255,255,255,0.8)' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: -20, marginBottom: 16 },
  statValue: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  sectionTitle: { fontSize: FONTS.h3.size, fontWeight: '700', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  menuSubtitle: { fontSize: 12 },
});

export default StudentProfileScreen;
