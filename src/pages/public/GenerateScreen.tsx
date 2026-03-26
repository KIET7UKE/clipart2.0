import React, { useEffect, useMemo, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { ArrowLeft, Download, Share2 } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { useGenerate } from '../../hooks/useGenerate';
import { ResultGrid } from '../../components/ResultGrid';
import { imageService } from '../../services/imageService';
import { AnimatedButton } from '../../components/AnimatedButton';
import { Colors, Layout } from '../../utils/theme/DesignSystem';
import { useToast } from '../../components/ToastProvider';

type GenerateScreenRouteProp = RouteProp<RootStackParamList, 'GenerateScreen'>;

const GenerateScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<GenerateScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedImage, originalImageUri, styles: selectedStyleIds, customPrompt, styleIntensity, userId } = route.params;
  const { showToast } = useToast();
  
  const { results, loading, generateAll, retryStyle } = useGenerate();
  const [showSplash, setShowSplash] = useState(true);

  // Initial splash, then kick off generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (selectedImage) {
        generateAll(selectedImage, selectedStyleIds, customPrompt, styleIntensity ?? 3, userId);
      }
    }, 1200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedCount = useMemo(() => {
    return Object.values(loading).filter(l => !l).length;
  }, [loading]);

  const progressPercent = selectedStyleIds.length > 0
    ? (completedCount / selectedStyleIds.length) * 100
    : 0;
  
  const progressWidth = useSharedValue(0);
  useEffect(() => {
    if (!showSplash) {
      progressWidth.value = withTiming(progressPercent, { duration: 500 });
    }
  }, [progressPercent, showSplash]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleDownloadAll = async () => {
    try {
      const { success, total } = await imageService.downloadAllImages(results);
      if (success > 0) {
        showToast(`${success} of ${total} styles saved to gallery!`);
      } else if (total > 0) {
        showToast('Download failed. Please check permissions.', 'error');
      } else {
        showToast('No images ready to download.', 'info');
      }
    } catch (err) {
      showToast('Download failed', 'error');
    }
  };

  const handleShareAll = async () => {
    const successfulImages = Object.values(results).filter(
      r => r && r !== 'error',
    ) as string[];
    if (successfulImages.length === 0) {
      showToast('Generating...', 'info');
      return;
    }
    await imageService.shareImage(successfulImages[0]);
  };

  const handleGoBack = () => {
    if (completedCount < selectedStyleIds.length) {
      Alert.alert(
        'Abort Generation?',
        'Generating art takes time. Are you sure you want to go back?',
        [
          { text: 'Wait', style: 'cancel' },
          { text: 'Yes, Leave', onPress: () => navigation.goBack(), style: 'destructive' },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  if (showSplash) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <Animated.View exiting={FadeOut.duration(500)} style={styles.splashContent}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🛸</Text>
          </View>
          <Text style={styles.splashTitle}>Brewing Your Art...</Text>
          <Text style={styles.splashSubtitle}>
            {customPrompt
              ? `With style: "${customPrompt.substring(0, 40)}${customPrompt.length > 40 ? '…' : ''}"`
              : 'Wait a moment while AI builds your styles'}
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft color={Colors.text} size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Collection Art</Text>
            <Text style={styles.progressText}>
              {selectedStyleIds.length === 1 
                ? 'Generating 1 style' 
                : `${completedCount} of ${selectedStyleIds.length} styles ready`
              }
            </Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(800)} style={styles.gridContainer}>
        <ResultGrid 
          results={results} 
          loading={loading} 
          onRetry={(style) => retryStyle(style.id)}
          originalImageUri={originalImageUri}
        />
      </Animated.View>

      {/* Glassmorphic Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <AnimatedButton style={[styles.actionButton, styles.secondaryButton]} onPress={handleShareAll}>
          <View style={styles.btnContent}>
            <Share2 color={Colors.text} size={18} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Share</Text>
          </View>
        </AnimatedButton>
        <AnimatedButton style={[styles.actionButton, styles.secondaryButton]} onPress={handleDownloadAll}>
          <View style={styles.btnContent}>
            <Download color={Colors.text} size={18} style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Download All</Text>
          </View>
        </AnimatedButton> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.background },
  splashContainer: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  splashContent: { alignItems: 'center' },
  logoBadge: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.surfaceContainerHighest, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  logoEmoji: { fontSize: 40 },
  splashTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  splashSubtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 10, textAlign: 'center', paddingHorizontal: 40 },
  
  header: { 
    paddingHorizontal: Layout.spacing.lg, 
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  backButton: { marginRight: 8, padding: 4 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  progressText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  
  progressBarBg: { height: 4, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden', marginTop: 12 },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary },
  
  gridContainer: { flex: 1, paddingTop: 12 },
  
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(14, 14, 14, 0.98)', 
    flexDirection: 'row', 
    paddingHorizontal: Layout.spacing.lg, 
    paddingTop: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionButton: { flex: 1, height: 50, borderRadius: 25, overflow: 'hidden' },
  secondaryButton: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 13 },
});

export default GenerateScreen;
