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
import { Download, Share2, ZoomIn, RotateCcw } from 'lucide-react-native';
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

  const handleSave = async () => {
    if (!result || result === 'error') return;
    const success = await imageService.downloadImage(result, style.label);
    if (!success) {
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  const handleShare = async () => {
    if (!result || result === 'error') return;
    await imageService.shareImage(result);
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
        <Text style={styles.label} numberOfLines={1}>{style.label}</Text>
      </View>

      <View style={styles.content}>
        {result === 'error' ? (
          <AnimatedButton onPress={onRetry} style={styles.errorContainer}>
            <RotateCcw color={Colors.text} size={24} />
            <Text style={styles.errorText}>Retry</Text>
          </AnimatedButton>
        ) : result ? (
          <View style={styles.imageWrapper}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => setModalVisible(true)}
              style={styles.imageBtn}
            >
              <Image
                source={{ uri: result }}
                style={styles.image}
                resizeMode="cover"
              />
              {/* Overlay Overlay Indicators */}
              <View style={styles.zoomIndicator}>
                 <ZoomIn color="#FFF" size={16} />
              </View>
            </TouchableOpacity>

            {/* Clear Action Touch Points */}
            <View style={styles.actionOverlay}>
               <TouchableOpacity style={styles.miniActionBtn} onPress={handleSave}>
                  <Download color="#FFF" size={16} />
               </TouchableOpacity>
               <TouchableOpacity style={styles.miniActionBtn} onPress={handleShare}>
                  <Share2 color="#FFF" size={16} />
               </TouchableOpacity>
            </View>
          </View>
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
              <View style={styles.modalActions}>
                 <TouchableOpacity onPress={handleSave} style={styles.modalActionItem}>
                    <Download color="#FFF" size={24} />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={handleShare} style={styles.modalActionItem}>
                    <Share2 color="#FFF" size={24} />
                 </TouchableOpacity>
              </View>
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
    height: CARD_WIDTH * 1.35,
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
    marginBottom: 10,
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
  imageBtn: { flex: 1 },
  image: { width: '100%', height: '100%' },
  zoomIndicator: { 
     position: 'absolute', 
     top: 8, 
     right: 8, 
     backgroundColor: 'rgba(0,0,0,0.5)', 
     padding: 6, 
     borderRadius: 12 
  },
  actionOverlay: { 
     position: 'absolute', 
     bottom: 0, 
     left: 0, 
     right: 0, 
     flexDirection: 'row', 
     justifyContent: 'center', 
     gap: 12, 
     paddingBottom: 8,
     backgroundColor: 'rgba(0,0,0,0.3)'
  },
  miniActionBtn: { 
     width: 36, 
     height: 36, 
     borderRadius: 18, 
     backgroundColor: 'rgba(255,255,255,0.2)', 
     justifyContent: 'center', 
     alignItems: 'center',
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.1)'
  },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  errorText: { color: Colors.error, fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  waitingText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '500' },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.98)', justifyContent: 'center', alignItems: 'center' },
  modalCloseArea: { ...StyleSheet.absoluteFillObject },
  modalContent: { width: width, height: height * 0.7, justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: width, height: height * 0.7 },
  modalFooter: { position: 'absolute', bottom: 60, alignItems: 'center', width: '100%' },
  modalActions: { flexDirection: 'row', gap: 24, marginBottom: 30 },
  modalActionItem: { 
     width: 60, 
     height: 60, 
     borderRadius: 30, 
     backgroundColor: 'rgba(255,255,255,0.1)', 
     justifyContent: 'center', 
     alignItems: 'center' 
  },
  closeBtn: { paddingHorizontal: 40, paddingVertical: 14, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  pinchHint: { color: 'rgba(255,255,255,0.4)', marginTop: 20, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
});
