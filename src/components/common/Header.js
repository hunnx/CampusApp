import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Header = ({ title, onBackPress, rightComponent, style }) => {
  return (
    <View style={[styles.header, style]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {onBackPress ? (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightComponent || <View style={styles.backButtonPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  backButtonPlaceholder: {
    width: 36,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default Header;
