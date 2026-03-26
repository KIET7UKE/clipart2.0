import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, Image } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { SkeletonCard } from './SkeletonCard';
import { imageService } from '../services/imageService';
import { ClipartStyle } from '../utils/constant/styles';
import { AnimatedButton } from './AnimatedButton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface Props {
  style: ClipartStyle;
  loading: boolean;
  result: string | 'error' | null;
  onRetry: () => void;
  index: number;
}

export const StyleCard: React.FC<Props> = ({
  style,
  loading,
  result,
  onRetry,
  index,
}) => {
  // 1. Shake Animation for Error State
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    if (result === 'error') {
      shakeOffset.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 }),
        ),
        5,
        true,
        () => {
          shakeOffset.value = 0;
        },
      );
    }
  }, [result]);

  const animatedShake = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const handleLongPress = () => {
    if (result && result !== 'error') {
      Alert.alert(
        'Image Options',
        'Choose an action for this clipart:',
        [
          { text: 'Download', onPress: () => handleSave(result) },
          { text: 'Share', onPress: () => handleShare(result) },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true },
      );
    }
  };

  const handleSave = async (uri: string) => {
    const success = await imageService.downloadImage(uri, style.label);
    if (!success) {
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const handleShare = async (uri: string) => {
    await imageService.shareImage(uri);
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.emoji}>{style.emoji}</Text>
        <Text style={styles.label}>{style.label}</Text>

        {/* 2. GREEN CHECKMARK BADGE on successful result */}
        {result && result !== 'error' && (
          <Animated.View
            entering={FadeIn.delay(500)}
            style={styles.checkmarkBadge}
          >
            <Text style={styles.checkmark}>✓</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.content}>
        {result === 'error' ? (
          <AnimatedButton onPress={onRetry} style={styles.errorContainer}>
            <Text style={styles.retryIcon}>🔄</Text>
            <Text style={styles.errorText}>Failed</Text>
            <Text style={styles.retryText}>Tap to retry</Text>
          </AnimatedButton>
        ) : result ? (
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: result }}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
              onError={e =>
                console.error(
                  'Image Load Error:',
                  e.nativeEvent.error,
                  'URI:',
                  result,
                )
              }
            />
          </Animated.View>
        ) : (
          <View style={styles.emptyContainer} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  emoji: { fontSize: 18, marginRight: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#FFF', flex: 1 },
  checkmarkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: { fontSize: 10, color: '#FFF', fontWeight: 'bold' },
  content: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0D0D0D',
  },
  imageWrapper: { width: '100%', height: '100%' },
  image: { width: '100%', height: '100%' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryIcon: { fontSize: 24, marginBottom: 4 },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },
  retryText: { color: '#A0A0A0', fontSize: 10, marginTop: 2 },
  emptyContainer: { flex: 1 },
});
