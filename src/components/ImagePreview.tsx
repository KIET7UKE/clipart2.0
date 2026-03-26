import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { THEME } from '../constants/theme';

interface Props {
  uri: string;
  onClear: () => void;
  onConfirm?: () => void;
}

export const ImagePreview: React.FC<Props> = ({ uri, onClear, onConfirm }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.buttonClear} onPress={onClear}>
          <Text style={styles.buttonText}>Change Image</Text>
        </TouchableOpacity>
        {onConfirm && (
          <TouchableOpacity style={styles.buttonConfirm} onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: THEME.borderRadius.md,
  },
  controls: {
    flexDirection: 'row',
    marginTop: THEME.spacing.md,
    justifyContent: 'center',
    width: '100%',
  },
  buttonClear: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    marginRight: THEME.spacing.md,
  },
  buttonConfirm: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.md,
  },
  buttonText: {
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
