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

const ShopkeeperProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, isLoading } = useSelector(state => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    shopName: '',
    shopDescription: '',
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
        shopName: profile.shopName || '',
        shopDescription: profile.shopDescription || '',
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

    if (!formData.shopName) {
      newErrors.shopName = 'Shop name is required';
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
            source={{ uri: profile?.avatar || 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=SK' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Text style={styles.editAvatarText}>📷</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{profile?.name || 'Shopkeeper'}</Text>
          <Text style={styles.shopName}>{profile?.shopName || 'Your Shop'}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
        </View>
      </View>
    );
  };

  const renderStatsSection = () => {
    return (
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Shop Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Revenue</Text>
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
          editable={false} // Email should not be editable
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
          label="Shop Name"
          value={formData.shopName}
          onChangeText={(value) => handleInputChange('shopName', value)}
          placeholder="Enter your shop name"
          error={errors.shopName}
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
          label="Shop Description"
          value={formData.shopDescription}
          onChangeText={(value) => handleInputChange('shopDescription', value)}
          placeholder="Describe your shop"
          multiline
          numberOfLines={4}
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
      <Header title="My Profile" onBackPress={() => navigation.goBack()} />
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
    paddingBottom: 60,
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
  shopName: {
    fontSize: SIZES.font + 2,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SIZES.base / 2,
  },
  userEmail: {
    fontSize: SIZES.font,
    color: COLORS.gray,
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

export default ShopkeeperProfileScreen;
