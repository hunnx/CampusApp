import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme/ThemeContext';
import { BORDER_RADIUS } from '../../constants';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onFocus,
  onBlur,
  onClear,
  style,
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => { setFocused(true); onFocus && onFocus(e); };
  const handleBlur = (e) => { setFocused(false); onBlur && onBlur(e); };
  const handleClear = () => { onChangeText && onChangeText(''); onClear && onClear(); };

  return React.createElement(View, {
    style: [styles.container, {
      backgroundColor: colors.light,
      borderColor: focused ? colors.primary : colors.border,
      borderWidth: focused ? 1.5 : 1,
    }, style]
  },
    React.createElement(Icon, {
      name: 'search-outline',
      size: 20,
      color: focused ? colors.primary : colors.grayLight,
      style: styles.searchIcon
    }),
    React.createElement(TextInput, {
      value,
      onChangeText,
      placeholder,
      placeholderTextColor: colors.grayLight,
      style: [styles.input, { color: colors.dark }],
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    value && value.length > 0 && React.createElement(TouchableOpacity, {
      onPress: handleClear,
      style: styles.clearButton
    }, React.createElement(Icon, { name: 'close-circle', size: 18, color: colors.grayLight }))
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 8 },
  clearButton: { marginLeft: 8, padding: 2 },
});

export default SearchBar;
