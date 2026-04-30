import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTENT_BOTTOM_PADDING, SIZES } from '../../constants';

/**
 * BottomSpacerView
 * 
 * Adds extra bottom padding to ensure content scrolls completely above the bottom tab bar.
 * Uses dynamic safe area insets for proper support on both Android and iOS.
 * 
 * Dimensions (with dynamic insets):
 * - Tab Bar Height: 72px
 * - Tab Bar Bottom Margin: 16px  
 * - Safe Area Insets Bottom: Dynamic (from useSafeAreaInsets)
 * - Extra Padding: Configurable
 * - Total: ~104px + insets.bottom + extraPadding
 * 
 * @param {Object} props - Component props
 * @param {number} props.extraPadding - Additional padding beyond base padding (default: SIZES.padding)
 * @param {boolean} props.useDynamicInsets - Whether to use dynamic safe area insets (default: true)
 * @returns {JSX.Element}
 */
const BottomSpacerView = ({ 
  extraPadding = SIZES.padding,
  useDynamicInsets = true 
}) => {
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding: base ContentBottomPadding + safe area insets + extra padding
  const bottomPadding = useDynamicInsets 
    ? CONTENT_BOTTOM_PADDING + insets.bottom + extraPadding
    : CONTENT_BOTTOM_PADDING + extraPadding;
  
  return <View style={{ height: bottomPadding }} />;
};

export default BottomSpacerView;
