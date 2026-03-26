import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder backgroundColor="#1A1A1A" highlightColor="#333">
        <View style={styles.skeletonContent}>
           <View style={styles.headerRow} />
           <View style={styles.imageBox} />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  skeletonContent: {
    padding: 12,
  },
  headerRow: {
    width: '60%',
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
  },
  imageBox: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
});
