import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors } from '../utils/theme/DesignSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  beforeUri: string;  // original photo
  afterUri: string;   // AI generated clipart
  height?: number;
}

export const BeforeAfterSlider: React.FC<Props> = ({
  beforeUri,
  afterUri,
  height = SCREEN_WIDTH * 1.05,
}) => {
  // dividerX is 0..1 (fraction of card width)
  const dividerX = useSharedValue(0.5);
  const startX = useSharedValue(0.5);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = dividerX.value;
    })
    .onUpdate((e) => {
      const newVal = startX.value + e.translationX / SCREEN_WIDTH;
      dividerX.value = clamp(newVal, 0.04, 0.96);
    });

  // Animated style for the "before" clipping mask (shows left portion)
  const beforeMaskStyle = useAnimatedStyle(() => ({
    width: `${dividerX.value * 100}%`,
  }));

  // Animated style for the handle / divider line
  const dividerStyle = useAnimatedStyle(() => ({
    left: `${dividerX.value * 100}%`,
    transform: [{ translateX: -20 }], // center the 40-wide handle
  }));

  return (
    <View style={[styles.container, { height }]}>
      {/* AFTER image (full width, underneath) */}
      <Image
        source={{ uri: afterUri }}
        style={styles.afterImage}
        resizeMode="cover"
      />

      {/* BEFORE image (clipped to left side) */}
      <Animated.View style={[styles.beforeMask, beforeMaskStyle]}>
        <Image
          source={{ uri: beforeUri }}
          style={[styles.beforeImage, { width: SCREEN_WIDTH }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Divider Line */}
      <Animated.View style={[styles.dividerLine, dividerStyle]} pointerEvents="none" />

      {/* Drag Handle — wrapped in GestureDetector */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.handleWrap, dividerStyle]}>
          <View style={styles.handle}>
            <View style={styles.arrowLeft} />
            <View style={styles.arrowRight} />
          </View>
        </Animated.View>
      </GestureDetector>

      {/* Labels */}
      <View style={styles.labelBefore} pointerEvents="none">
        <Text style={styles.labelText}>BEFORE</Text>
      </View>
      <View style={styles.labelAfter} pointerEvents="none">
        <Text style={styles.labelText}>AFTER</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
  },
  afterImage: {
    ...StyleSheet.absoluteFillObject,
  },
  beforeMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  beforeImage: {
    height: '100%',
  },
  dividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  handleWrap: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.accent,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.accent,
  },
  labelBefore: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  labelAfter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: `${Colors.primary}AA`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  labelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
