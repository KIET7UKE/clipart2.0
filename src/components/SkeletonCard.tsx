import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors, Layout } from '../utils/theme/DesignSystem';

const { width } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = (width - Layout.spacing.lg * 2 - 16) / 2;

interface Props {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonCard: React.FC<Props> = ({ 
  width: cardWidth = DEFAULT_CARD_WIDTH, 
  height: cardHeight = DEFAULT_CARD_WIDTH * 1.35,
  borderRadius = 20,
  style
}) => {
  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight, borderRadius }, style]}>
      <SkeletonPlaceholder 
        backgroundColor={Colors.surfaceContainerHigh} 
        highlightColor="#333"
        speed={1500}
      >
        <View style={styles.skeletonContent}>
           {/* Header label area */}
           <View style={styles.headerRow} />
           
           {/* Image content area */}
           <View style={[styles.imageBox, { height: cardHeight - 60 }]} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  skeletonContent: {
    padding: 12,
  },
  headerRow: {
    width: '70%',
    height: 14,
    borderRadius: 7,
    marginBottom: 14,
  },
  imageBox: {
    width: '100%',
    borderRadius: 12,
  },
});
