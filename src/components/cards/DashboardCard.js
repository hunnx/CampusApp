import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '../../constants';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon,
  color = COLORS.primary,
  onPress,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: color }, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}
        </View>
        
        {loading ? (
          <ActivityIndicator size="large" color={color} />
        ) : (
          <Text style={[styles.value, { color }]}>{value}</Text>
        )}
        
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.base / 2,
    marginBottom: SIZES.base,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  title: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontWeight: '500',
    flex: 1,
    marginRight: SIZES.base,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: SIZES.font + 4,
    color: COLORS.white,
  },
  value: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  subtitle: {
    fontSize: SIZES.font - 2,
    color: COLORS.gray,
  },
});

export default DashboardCard;
