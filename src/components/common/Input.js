import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error = null,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          multiline && styles.multilineInput,
          !editable && styles.disabledInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.base,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.font,
    color: COLORS.dark,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: COLORS.light,
    color: COLORS.gray,
  },
  errorText: {
    fontSize: SIZES.font - 2,
    color: COLORS.danger,
    marginTop: SIZES.base / 2,
  },
});

export default Input;
