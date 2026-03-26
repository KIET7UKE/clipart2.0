import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Dimensions, 
  Alert, 
  Image, 
  Modal, 
  TouchableOpacity 
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SkeletonCard } from './SkeletonCard';
import { imageService } from '../services/imageService';
import { ClipartStyle } from '../utils/constant/styles';
import { AnimatedButton } from './AnimatedButton';
import { Colors, Layout } from '../utils/theme/DesignSystem';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - Layout.spacing.lg * 2 - 16) / 2;

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
  const [modalVisible, setModalVisible] = useState(false);
  const shakeOffset = useSharedValue(0);

  // Zoom gestures state
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

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

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
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

  const closeZoom = () => {
     setModalVisible(false);
     scale.value = withTiming(1);
     savedScale.value = 1;
  };

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Animated.View style={[styles.container, animatedShake]}>
      <View style={styles.header}>
        <Text style={styles.label}>{style.label}</Text>
      </View>

      <View style={styles.content}>
        {result === 'error' ? (
          <AnimatedButton onPress={onRetry} style={styles.errorContainer}>
            <Text style={styles.retryIcon}>🔄</Text>
            <Text style={styles.errorText}>Retry</Text>
          </AnimatedButton>
        ) : result ? (
          <AnimatedButton 
            onPress={() => setModalVisible(true)}
            onLongPress={handleLongPress}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: result }}
              style={styles.image}
              resizeMode="cover"
            />
          </AnimatedButton>
        ) : (
          <View style={styles.emptyContainer}>
             <Text style={styles.waitingText}>Cooking...</Text>
          </View>
        )}
      </View>

      {/* Zoom Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeZoom}
      >
        <GestureHandlerRootView style={styles.modalBg}>
           <TouchableOpacity activeOpacity={1} style={styles.modalCloseArea} onPress={closeZoom} />
           
           <View style={styles.modalContent}>
              <GestureDetector gesture={pinchGesture}>
                 <Animated.View style={zoomStyle}>
                    <Image 
                      source={{ uri: result as string }} 
                      style={styles.fullImage} 
                      resizeMode="contain" 
                    />
                 </Animated.View>
              </GestureDetector>
           </View>

           <View style={styles.modalFooter}>
              <TouchableOpacity onPress={closeZoom} style={styles.closeBtn}>
                 <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
              <Text style={styles.pinchHint}>Pinch to Zoom</Text>
           </View>
        </GestureHandlerRootView>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  label: { fontSize: 13, fontWeight: 'bold', color: Colors.text, flex: 1 },
  content: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  imageWrapper: { width: '100%', height: '100%' },
  image: { width: '100%', height: '100%' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  retryIcon: { fontSize: 20, marginBottom: 4 },
  errorText: { color: Colors.error, fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  waitingText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '500' },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalCloseArea: { ...StyleSheet.absoluteFillObject },
  modalContent: { width: width, height: height * 0.7, justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: width, height: height * 0.7 },
  modalFooter: { position: 'absolute', bottom: 60, alignItems: 'center' },
  closeBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.1)' },
  closeBtnText: { color: '#FFF', fontWeight: 'bold' },
  pinchHint: { color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 12 },
});
