import React, { useEffect, useMemo, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Alert, 
  Dimensions,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { useGenerate } from '../../hooks/useGenerate';
import { ResultGrid } from '../../components/ResultGrid';
import { imageService } from '../../services/imageService';
import { CLIPART_STYLES } from '../../utils/constant/styles';
import { AnimatedButton } from '../../components/AnimatedButton';
import { Colors, Layout, Gradients } from '../../utils/theme/DesignSystem';

const { width } = Dimensions.get('window');

type GenerateScreenRouteProp = RouteProp<RootStackParamList, 'GenerateScreen'>;

const GenerateScreen: React.FC = () => {
  const route = useRoute<GenerateScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedImage, styles: selectedStyleIds } = route.params;
  
  const { results, loading, generateAll } = useGenerate();
  const [showSplash, setShowSplash] = useState(true);

  // 1. Initial 1s Splash State
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (selectedImage) generateAll(selectedImage, selectedStyleIds);
    }, 1200);
    return () => clearTimeout(timer);
  }, [selectedImage, selectedStyleIds]);

  const completedCount = useMemo(() => {
    return Object.values(loading).filter(l => !l).length;
  }, [loading]);

  const progressPercent = (completedCount / selectedStyleIds.length) * 100;
  
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
      await imageService.downloadAllImages(results);
    } catch (err) {
      Alert.alert('Error', 'Failed to download some images.');
    }
  };

  const handleShareAll = async () => {
     const successfulImages = Object.values(results).filter(r => r && r !== 'error') as string[];
     if (successfulImages.length === 0) return;
     await imageService.shareImage(successfulImages[0]);
  };

  const handleGoBack = () => {
     if (completedCount < CLIPART_STYLES.length) {
        Alert.alert(
          'Abort Generation?',
          'Generating art takes time. Are you sure you want to go back?',
          [
            { text: 'Wait', style: 'cancel' },
            { text: 'Yes, Leave', onPress: () => navigation.goBack(), style: 'destructive' }
          ]
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
          <Text style={styles.splashSubtitle}>Wait a moment while AI builds your styles</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
             <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
             <Text style={styles.headerTitle}>Collective Art</Text>
             <Text style={styles.progressText}>
                {completedCount} of {CLIPART_STYLES.length} styles ready
             </Text>
          </View>

          {selectedImage && (
            <View style={styles.originalWrapper}>
               <Image source={{ uri: `data:image/jpeg;base64,${selectedImage}` }} style={styles.originalImage} resizeMode="cover" />
            </View>
          )}
        </View>

        <View style={styles.progressBarBg}>
           <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(800)} style={styles.gridContainer}>
        <ResultGrid 
          results={results} 
          loading={loading} 
          onRetry={(style) => {
             // Logic to re-trigger generation for a specific style could go here
             Alert.alert('Retrying', `Regenerating ${style.label}...`);
          }} 
        />
      </Animated.View>

      {/* Glassmorphic Bottom Bar */}
      <View style={styles.bottomBar}>
        <AnimatedButton style={[styles.actionButton, styles.secondaryButton]} onPress={handleShareAll}>
          <Text style={styles.buttonText}>Share Batch</Text>
        </AnimatedButton>

        <AnimatedButton style={[styles.actionButton, styles.primaryButton]} onPress={handleDownloadAll}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.buttonTextDark}>Download All</Text>
          </LinearGradient>
        </AnimatedButton>
      </View>
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  backIcon: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
  headerTitleContainer: { flex: 1, marginHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  progressText: { fontSize: 12, color: Colors.primary, marginTop: 2, fontWeight: 'bold' },
  originalWrapper: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    padding: 2, 
    backgroundColor: 'rgba(208, 149, 255, 0.3)' 
  },
  originalImage: { width: '100%', height: '100%', borderRadius: 20 },
  
  progressBarBg: { height: 4, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden', marginTop: 12 },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary },
  
  gridContainer: { flex: 1, paddingTop: 12 },
  
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(14,14,14,0.9)', 
    flexDirection: 'row', 
    padding: Layout.spacing.lg, 
    paddingBottom: 40, 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionButton: { flex: 1, height: 56, borderRadius: 28, overflow: 'hidden' },
  primaryButton: { },
  secondaryButton: { backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: Colors.text, fontWeight: 'bold', fontSize: 15 },
  buttonTextDark: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});

export default GenerateScreen;
