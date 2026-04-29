import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS, FONTS } from '../../constants';

const ModernInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error = null,
  success = false,
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  containerStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [labelAnim] = useState(new Animated.Value(value ? 1 : 0));

  const animateLabel = useCallback((toValue) => {
    Animated.timing(labelAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [labelAnim]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    animateLabel(1);
  }, [animateLabel]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (!value) {
      animateLabel(0);
    }
  }, [value, animateLabel]);

  const toggleSecure = useCallback(() => {
    setIsSecure(prev => !prev);
  }, []);

  const getBorderColor = () => {
    if (error) return colors.danger;
    if (success) return colors.success;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const labelStyle = {
    position: 'absolute',
    left: leftIcon ? 48 : 16,
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, -10],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [FONTS.body.size, FONTS.caption.size],
    }),
    color: error
      ? colors.danger
      : isFocused
      ? colors.primary
      : colors.grayLight,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      <View
        style={[
          styles.container,
          {
            borderColor: getBorderColor(),
            borderRadius: BORDER_RADIUS.lg,
            backgroundColor: editable ? colors.surface : colors.light,
          },
          style,
        ]}
      >
        {label && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}

        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.grayLight}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={isFocused || !label ? placeholder : ''}
          placeholderTextColor={colors.grayLight}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            {
              color: colors.dark,
              paddingLeft: leftIcon ? 48 : 16,
              paddingRight: secureTextEntry || rightIcon ? 48 : 16,
              paddingTop: label ? 18 : 14,
              paddingBottom: label ? 10 : 14,
            },
          ]}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecure}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.grayLight}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>
            <Icon
              name={rightIcon}
              size={20}
              color={isFocused ? colors.primary : colors.grayLight}
            />
          </View>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error}
        </Text>
      )}

      {success && !error && (
        <Icon
          name="checkmark-circle"
          size={18}
          color={colors.success}
          style={styles.successIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: FONTS.body.size,
    fontWeight: FONTS.body.weight,
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    fontSize: FONTS.caption.size,
    marginTop: 4,
    marginLeft: 4,
  },
  successIcon: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default ModernInput;
