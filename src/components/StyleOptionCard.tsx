import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
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
        <Image source={style.sample} style={styles.sampleIcon} resizeMode="cover" />
      </View>
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {style.label}
      </Text>
      {isSelected && <View style={styles.checkBadge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(208, 149, 255, 0.1)',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  sampleIcon: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  selectedLabel: {
    color: Colors.primary,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
