import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors, Layout } from '../utils/theme/DesignSystem';
import { CLIPART_STYLES, ClipartStyle } from '../utils/constant/styles';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.45;
const ITEM_HEIGHT = ITEM_WIDTH * 1.4;

export const StyleCarousel: React.FC = () => {
  const renderItem = ({ item, index }: { item: ClipartStyle; index: number }) => (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(500)}
      style={styles.card}
    >
      <LinearGradient
        colors={[Colors.surfaceContainerHigh, Colors.surfaceContainerLow]}
        style={styles.cardGradient}
      >
        <View style={styles.imagePlaceholder}>
          <Image source={item.sample} style={styles.sampleImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.cardOverlay}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.styleLabel}>{item.label}</Text>
          <Text style={styles.styleDesc}>AI Crafted Artwork</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Explore Styles</Text>
      <FlatList
        data={CLIPART_STYLES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + 16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  listContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: Layout.spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerHigh,
    
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
  },
  imagePlaceholder: {
    flex: 1,
    overflow: 'hidden',
  },
  sampleImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: Layout.spacing.md,
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  styleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
