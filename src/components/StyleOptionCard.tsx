import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors, Layout } from '../utils/theme/DesignSystem';
import { ClipartStyle } from '../utils/constant/styles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 24) / 3;

interface Props {
  style: ClipartStyle;
  isSelected: boolean;
  onSelect: (style: ClipartStyle) => void;
}

export const StyleOptionCard: React.FC<Props> = ({
  style,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(style)}
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{style.emoji}</Text>
      </View>
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {style.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(208, 149, 255, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emoji: { fontSize: 24 },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedLabel: {
    color: Colors.primary,
  },
});
