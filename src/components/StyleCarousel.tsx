import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInRight, FadeIn, Layout as ReanimatedLayout } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { Colors, Layout } from '../utils/theme/DesignSystem';
import { CLIPART_STYLES, ClipartStyle } from '../utils/constant/styles';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.45;
const ITEM_HEIGHT = ITEM_WIDTH * 1.4;

export const StyleCarousel: React.FC = () => {
  const [likedStyles, setLikedStyles] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedStyles(prev => 
      prev.includes(id) ? prev.filter(styleId => styleId !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item, index }: { item: ClipartStyle; index: number }) => {
    const isLiked = likedStyles.includes(item.id);
    
    return (
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
              colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
              style={styles.cardOverlay}
            />
            
            {/* Heart Button Overlay */}
            <TouchableOpacity 
              onPress={() => toggleLike(item.id)}
              style={styles.heartButton}
              activeOpacity={0.7}
            >
              <Heart 
                color={isLiked ? Colors.primary : '#FFF'} 
                fill={isLiked ? Colors.primary : 'transparent'} 
                size={16} 
              />
            </TouchableOpacity>
            
            <View style={styles.content}>
              <Text style={styles.styleLabel} numberOfLines={1}>{item.label}</Text>
              <Text style={styles.styleDesc}>AI Magic Crafted</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Explore Styles</Text>
        {/* <TouchableOpacity>
          <Text style={styles.viewAll}>See All</Text>
        </TouchableOpacity> */}
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginRight: Layout.spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.md,
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  styleDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
});
