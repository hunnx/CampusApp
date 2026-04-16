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
import { logout, clearError } from '../../redux/slices/authSlice';
import { fetchUserProfile, updateProfile } from '../../redux/slices/userSlice';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES } from '../../constants';

const DelivererProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, isLoading } = useSelector(state => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicleNumber: '',
    vehicleType: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await dispatch(fetchUserProfile(user?.id)).unwrap();
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        vehicleNumber: profile.vehicleNumber || '',
        vehicleType: profile.vehicleType || '',
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.vehicleNumber) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const renderProfileHeader = () => {
    return (
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: profile?.avatar || 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=DL' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>📷</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{profile?.name || 'Deliverer'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          <Text style={styles.userType}>Deliverer Account</Text>
        </View>
      </View>
    );
  };

  const renderStatsSection = () => {
    return (
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Delivery Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>PKR 0</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEditForm = () => {
    return (
      <View style={styles.editForm}>
        <Text style={styles.sectionTitle}>Edit Profile</Text>
        
        <Input
          label="Full Name"
          value={formData.name}
          onChangeText={(value) => handleInputChange('name', value)}
          placeholder="Enter your full name"
          error={errors.name}
          editable={isEditing}
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          error={errors.phone}
          editable={isEditing}
        />

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
          placeholder="Enter your address"
          multiline
          numberOfLines={3}
          editable={isEditing}
        />

        <Input
          label="Vehicle Number"
          value={formData.vehicleNumber}
          onChangeText={(value) => handleInputChange('vehicleNumber', value)}
          placeholder="Enter your vehicle number"
          error={errors.vehicleNumber}
          editable={isEditing}
        />

        <Input
          label="Vehicle Type"
          value={formData.vehicleType}
          onChangeText={(value) => handleInputChange('vehicleType', value)}
          placeholder="Bike, Cycle, etc."
          editable={isEditing}
        />

        {isEditing && (
          <View style={styles.editActions}>
            <Button
              title="Save Changes"
              onPress={handleUpdateProfile}
              loading={isLoading}
              style={styles.saveButton}
            />
            <Button
              title="Cancel"
              onPress={() => setIsEditing(false)}
              type="outline"
              style={styles.cancelButton}
            />
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => {
    return (
      <View style={styles.actionsSection}>
        {!isEditing && (
          <Button
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          />
        )}
        
        <Button
          title="Logout"
          onPress={handleLogout}
          type="secondary"
          style={styles.logoutButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="My Profile" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      {renderProfileHeader()}
      {renderStatsSection()}
      {renderEditForm()}
      {renderActions()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  profileHeader: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarText: {
    fontSize: SIZES.font,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
  },
  userEmail: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  userType: {
    fontSize: SIZES.font - 1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base / 2,
  },
  statLabel: {
    fontSize: SIZES.font - 1,
    color: COLORS.gray,
  },
  editForm: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  editActions: {
    marginTop: SIZES.padding,
  },
  saveButton: {
    marginBottom: SIZES.base,
  },
  cancelButton: {
    marginTop: SIZES.base,
  },
  actionsSection: {
    padding: SIZES.padding,
  },
  editButton: {
    marginBottom: SIZES.base,
  },
  logoutButton: {
    marginTop: SIZES.base,
  },
});

export default DelivererProfileScreen;
