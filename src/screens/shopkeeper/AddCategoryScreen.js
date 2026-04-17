import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '../../constants';

const AddCategoryScreen = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📂',
  });
  const [showIconModal, setShowIconModal] = useState(false);

  const icons = [
    '📂', '🍔', '🍕', '🍝', '🥪', '🥗', '🍦', '🍹',
    '🥤', '🍜', '🍱', '🥧', '🍧', '🍨', '🍩',
    '🥧', '🥨', '🥩', '🍪', '🍫', '🍬', '🍭',
    '🍮', '🍯', '🍰', '🍱', '🍲', '🍳', '🍴',
    '🍵', '🍶', '🍷', '🍸', '🍹', '🍺', '🍻',
  ];

  const handleSaveCategory = () => {
    const { name, description, icon } = formData;

    if (!name || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (name.length < 2) {
      Alert.alert('Error', 'Category name must be at least 2 characters');
      return;
    }

    // Simulate saving category
    Alert.alert('Success', 'Category saved successfully!', [
      {
        text: 'OK',
        onPress: () => navigate('ShopkeeperDashboard'),
      },
    ]);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIconSelect = (icon) => {
    updateFormData('icon', icon);
    setShowIconModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate('ShopkeeperDashboard')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📂 Add Category</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Category Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
            />
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter category description"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category Icon</Text>
            <TouchableOpacity
              style={styles.iconSelector}
              onPress={() => setShowIconModal(true)}
            >
              <Text style={styles.selectedIcon}>{formData.icon}</Text>
              <Text style={styles.iconDropdown}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
            <Text style={styles.saveButtonText}>💾 Save Category</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Icon Selection Modal */}
      <Modal
        visible={showIconModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIconModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <View style={styles.iconGrid}>
              {icons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.iconOption}
                  onPress={() => handleIconSelect(icon)}
                >
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowIconModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconSelector: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedIcon: {
    fontSize: 24,
  },
  iconDropdown: {
    fontSize: 12,
    color: '#666',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconOption: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionText: {
    fontSize: 24,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#f44336',
    fontWeight: '600',
  },
});

export default AddCategoryScreen;
