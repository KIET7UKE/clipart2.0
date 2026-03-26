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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { SkeletonCard } from './SkeletonCard';
import { imageService } from '../services/imageService';
import { ClipartStyle } from '../utils/constant/styles';
import { AnimatedButton } from './AnimatedButton';
import { Colors, Layout } from '../utils/theme/DesignSystem';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { useToast } from './ToastProvider';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = (width - Layout.spacing.lg * 2 - 16) / 2;

interface Props {
  style: ClipartStyle;
  loading: boolean;
  result: string | 'error' | null;
  onRetry: () => void;
  index: number;
  originalImageUri?: string; // for before/after slider
}

export const StyleCard: React.FC<Props> = ({
  style,
  loading,
  result,
  onRetry,
  index,
  originalImageUri,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const { showToast } = useToast();
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
    if (success) {
      showToast(`${style.label} saved!`);
    } else {
      showToast('Save failed', 'error');
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

  const insets = useSafeAreaInsets();

  return (
    <Animated.View style={[styles.container, animatedShake]}>
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>{style.label}</Text>
      </View>

      <View style={styles.content}>
        {loading ? (
          <SkeletonPlaceholder 
            backgroundColor="transparent" 
            highlightColor="#333"
            speed={1500}
          >
             <View style={{ width: '100%', height: '100%' }} />
          </SkeletonPlaceholder>
        ) : result === 'error' ? (
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
              <View style={styles.zoomIndicator}>
                 <ZoomIn color="#FFF" size={16} />
              </View>
            </TouchableOpacity>

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

       <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeZoom}
      >
        <GestureHandlerRootView style={styles.modalBg}>
           <TouchableOpacity activeOpacity={1} style={styles.modalCloseArea} onPress={closeZoom} />
           
           {/* Modal Header */}
           <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalHeaderTitle}>{style.label}</Text>
                <Text style={styles.pinchHint}>
                  {showBeforeAfter ? 'Drag divider to compare' : 'Pinch to Zoom'}
                </Text>
              </View>
              <View style={styles.modalHeaderRight}>
                {/* Before/After toggle — only show if we have the original */}
                {originalImageUri && (
                  <TouchableOpacity
                    style={[
                      styles.baToggle,
                      showBeforeAfter && styles.baToggleActive,
                    ]}
                    onPress={() => setShowBeforeAfter(v => !v)}
                  >
                    <Text style={[
                      styles.baToggleText,
                      showBeforeAfter && styles.baToggleTextActive,
                    ]}>
                      {showBeforeAfter ? 'Zoom' : 'Before/After'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.modalCloseCircle} onPress={closeZoom}>
                   <Text style={styles.modalCloseX}>✕</Text>
                </TouchableOpacity>
              </View>
           </View>

           <View style={styles.modalContent}>
              {showBeforeAfter && originalImageUri ? (
                <BeforeAfterSlider
                  beforeUri={originalImageUri}
                  afterUri={result as string}
                  height={height * 0.62}
                />
              ) : (
                <GestureDetector gesture={pinchGesture}>
                   <Animated.View style={zoomStyle}>
                      <Image 
                        source={{ uri: result as string }} 
                        style={styles.fullImage} 
                        resizeMode="contain" 
                      />
                   </Animated.View>
                </GestureDetector>
              )}
           </View>

           {/* Modal Footer */}
           <View style={[styles.modalFooter, { paddingBottom: Math.max(insets.bottom, 40) }]}>
              <View style={styles.modalActions}>
                 <TouchableOpacity onPress={handleSave} style={styles.modalActionItem}>
                    <Download color="#000" size={24} />
                    <Text style={styles.actionText}>Save Art</Text>
                 </TouchableOpacity>
                 <View style={styles.actionDivider} />
                 <TouchableOpacity onPress={handleShare} style={styles.modalActionItem}>
                    <Share2 color="#000" size={24} />
                    <Text style={styles.actionText}>Share</Text>
                 </TouchableOpacity>
              </View>
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
     bottom: 10, 
     left: 10, 
     right: 10, 
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     zIndex: 10,
  },
  miniActionBtn: { 
     width: 32, 
     height: 32, 
     borderRadius: 16, 
     backgroundColor: 'rgba(0,0,0,0.6)', 
     justifyContent: 'center', 
     alignItems: 'center',
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.2)'
  },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  errorText: { color: Colors.error, fontSize: 12, fontWeight: 'bold', marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131313' },
  waitingText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '500' },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.98)' },
  modalCloseArea: { ...StyleSheet.absoluteFillObject },
  modalHeader: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  modalHeaderLeft: { flex: 1 },
  modalHeaderTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  pinchHint: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4, letterSpacing: 0.5 },
  modalCloseCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseX: { color: '#FFF', fontSize: 18, fontWeight: '300' },
  
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullImage: { width: width, height: height * 0.7 },
  
  modalFooter: { 
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  modalActions: { 
    width: '100%',
    flexDirection: 'row', 
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 60,
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalActionItem: { 
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     height: '100%',
     gap: 10,
  },
  actionDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionText: { color: '#000', fontSize: 15, fontWeight: 'bold' },

  // Before/After toggle button in modal
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  baToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  baToggleActive: {
    backgroundColor: `${Colors.primary}33`,
    borderColor: Colors.primary,
  },
  baToggleText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: 'bold',
  },
  baToggleTextActive: {
    color: Colors.primary,
  },
});
