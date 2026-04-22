import React, { useState } from 'react';
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
import { updateProduct } from '../../redux/slices/productSlice';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/buttons/Button';
import { COLORS, SIZES, PRODUCT_CATEGORIES } from '../../constants';

const EditProductScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.products);
  
  const { product } = route.params;

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price.toString(),
    description: product.description || '',
    image: product.image,
    available: product.available,
  });

  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(product.category);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProduct = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await dispatch(updateProduct({ 
        id: product.id, 
        productData 
      })).unwrap();
      
      Alert.alert(
        'Success',
        'Product updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update product. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleInputChange('category', category);
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Image Upload',
      'Image picker is not connected yet, so the current backend image will be kept.'
    );
  };

  const renderCategorySelector = () => {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {PRODUCT_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderImageUpload = () => {
    return (
      <View style={styles.imageContainer}>
        <Text style={styles.label}>Product Image</Text>
        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
          <Image source={{ uri: formData.image }} style={styles.previewImage} />
          <View style={styles.changeImageOverlay}>
            <Text style={styles.changeImageText}>📷 Change Image</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAvailabilityToggle = () => {
    return (
      <View style={styles.availabilityContainer}>
        <Text style={styles.label}>Availability</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              formData.available && styles.toggleButtonActive,
            ]}
            onPress={() => handleInputChange('available', true)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                formData.available && styles.toggleButtonTextActive,
              ]}
            >
              Available
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !formData.available && styles.toggleButtonActive,
            ]}
            onPress={() => handleInputChange('available', false)}
          >
            <Text
              style={[
                styles.toggleButtonText,
                !formData.available && styles.toggleButtonTextActive,
              ]}
            >
              Unavailable
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Product" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Edit Product</Text>

      <Input
        label="Product Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
        placeholder="Enter product name"
        error={errors.name}
      />

      <Input
        label="Price (PKR)"
        value={formData.price}
        onChangeText={(value) => handleInputChange('price', value)}
        placeholder="Enter product price"
        keyboardType="numeric"
        error={errors.price}
      />

      {renderCategorySelector()}

      <Input
        label="Description"
        value={formData.description}
        onChangeText={(value) => handleInputChange('description', value)}
        placeholder="Enter product description"
        multiline
        numberOfLines={4}
        error={errors.description}
      />

      {renderImageUpload()}

      {renderAvailabilityToggle()}

      <View style={styles.buttonContainer}>
        <Button
          title="Update Product"
          onPress={handleUpdateProduct}
          loading={isLoading}
          style={styles.updateButton}
        />
        
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          type="outline"
          style={styles.cancelButton}
        />
      </View>
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
    padding: SIZES.padding,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  categoryContainer: {
    marginBottom: SIZES.base,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryChip: {
    width: '48%',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base / 2,
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  imageContainer: {
    marginBottom: SIZES.base,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: COLORS.light,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: SIZES.font,
  },
  availabilityContainer: {
    marginBottom: SIZES.base,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
    padding: SIZES.base / 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    alignItems: 'center',
    borderRadius: SIZES.radius / 2,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleButtonText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: COLORS.white,
  },
  buttonContainer: {
    marginTop: SIZES.padding,
  },
  updateButton: {
    marginBottom: SIZES.base,
  },
  cancelButton: {
    marginTop: SIZES.base,
  },
});

export default EditProductScreen;
