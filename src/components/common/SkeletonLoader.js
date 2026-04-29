import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useShimmer } from '../../utils/animationUtils';

const SkeletonLoader = ({ width = '100%', height = 16, borderRadius = 8, style }) => {
  const { colors } = useTheme();
  const { shimmerValue, startShimmer } = useShimmer();

  useEffect(() => {
    startShimmer();
  }, [startShimmer]);

  const shimmerStyle = {
    transform: [{
      translateX: shimmerValue.interpolate({
        inputRange: [-1, 1],
        outputRange: [-width, width],
      }),
    }],
  };

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: colors.lightSecondary, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.light, opacity: 0.6 }, shimmerStyle]} />
    </View>
  );
};

export const SkeletonCard = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <SkeletonLoader height={140} borderRadius={16} />
      <View style={styles.cardContent}>
        <SkeletonLoader width="70%" height={18} style={styles.marginBottom} />
        <SkeletonLoader width="40%" height={14} />
      </View>
    </View>
  );
};

export const SkeletonGrid = ({ count = 4 }) => (
  <View style={styles.grid}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </View>
);

export const SkeletonListItem = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.listItem, { backgroundColor: colors.surface }]}>
      <SkeletonLoader width={48} height={48} borderRadius={12} />
      <View style={styles.listContent}>
        <SkeletonLoader width="60%" height={16} style={styles.marginBottom} />
        <SkeletonLoader width="30%" height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 20, overflow: 'hidden', marginBottom: 16, flex: 1, marginHorizontal: 6 },
  cardContent: { padding: 16 },
  marginBottom: { marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12 },
  listContent: { flex: 1, marginLeft: 16 },
});

export default SkeletonLoader;
