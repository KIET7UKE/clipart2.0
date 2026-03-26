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
const CARD_WIDTH = width * 0.28;

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
      <Image source={style.sample} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={[styles.label, isSelected && styles.selectedLabel]}>
          {style.label}
        </Text>
      </View>
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
    padding: 0,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  selectedContainer: {
    borderColor: Colors.primary,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
