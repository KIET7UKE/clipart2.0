import React, { useEffect, useMemo, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Alert, 
  Dimensions,
  StatusBar
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
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { useGenerate } from '../../hooks/useGenerate';
import { ResultGrid } from '../../components/ResultGrid';
import { imageService } from '../../services/imageService';
import { CLIPART_STYLES } from '../../utils/constant/styles';
import { AnimatedButton } from '../../components/AnimatedButton';

const { width } = Dimensions.get('window');

type GenerateScreenRouteProp = RouteProp<RootStackParamList, 'GenerateScreen'>;

const GenerateScreen: React.FC = () => {
  const route = useRoute<GenerateScreenRouteProp>();
  const navigation = useNavigation();
  const { selectedImage } = route.params;
  
  const { results, loading, generateAll } = useGenerate();
  const [showSplash, setShowSplash] = useState(true);

  // 1. Initial 1s Splash State
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (selectedImage) generateAll(selectedImage);
    }, 1200);
    return () => clearTimeout(timer);
  }, [selectedImage]);

  const completedCount = useMemo(() => {
    return Object.values(loading).filter(l => !l).length;
  }, [loading]);

  const progressPercent = (completedCount / CLIPART_STYLES.length) * 100;
  
  // 2. Animated Progress Bar Width
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

  if (showSplash) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <Animated.View exiting={FadeOut.duration(500)} style={styles.splashContent}>
          <View style={styles.logoBadge}>
             <Text style={styles.logoEmoji}>✨</Text>
          </View>
          <Text style={styles.splashTitle}>Preparing your styles...</Text>
          <Text style={styles.splashSubtitle}>Wait a moment while we set up the AI models</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* 3. Custom Header with Progress Bar */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <AnimatedButton style={styles.backButton} onPress={() => navigation.goBack()}>
             <Text style={styles.backIcon}>←</Text>
          </AnimatedButton>
          
          <View style={styles.headerTitleContainer}>
             <Text style={styles.headerTitle}>Your Cliparts</Text>
             <Text style={styles.progressText}>
                {completedCount} of {CLIPART_STYLES.length} styles ready
             </Text>
          </View>

          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.originalImage} resizeMode="cover" />
          )}
        </View>

        {/* 4. Animated Progress Bar */}
        <View style={styles.progressBarBg}>
           <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(800)} style={styles.gridContainer}>
        <ResultGrid 
          results={results} 
          loading={loading} 
          onRetry={(style) => {
             Alert.alert('Retrying', `Generating ${style.label} again...`);
             // Implementation for retry would go here
          }} 
        />
      </Animated.View>

      <View style={styles.bottomBar}>
        <AnimatedButton style={[styles.actionButton, styles.secondaryButton]} onPress={handleShareAll}>
          <Text style={styles.buttonText}>Share</Text>
        </AnimatedButton>

        <AnimatedButton style={[styles.actionButton, styles.primaryButton]} onPress={handleDownloadAll}>
          <Text style={styles.buttonText}>Download All</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0D0D0D' },
  splashContainer: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center' },
  splashContent: { alignItems: 'center' },
  logoBadge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#7C3AED', shadowOpacity: 0.5, shadowRadius: 20 },
  logoEmoji: { fontSize: 44 },
  splashTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  splashSubtitle: { fontSize: 14, color: '#A0A0A0', marginTop: 8 },
  header: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', alignItems: 'center', marginBottom: 0 },
  backIcon: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerTitleContainer: { flex: 1, marginHorizontal: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF' },
  progressText: { fontSize: 13, color: '#7C3AED', marginTop: 2, fontWeight: '700' },
  originalImage: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#7C3AED' },
  progressBarBg: { height: 4, backgroundColor: '#1A1A1A', borderRadius: 2, overflow: 'hidden', marginTop: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#7C3AED' },
  gridContainer: { flex: 1 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(26,26,26,0.9)', flexDirection: 'row', padding: 24, paddingBottom: 40, borderTopLeftRadius: 32, borderTopRightRadius: 32, gap: 12 },
  actionButton: { flex: 1, height: 56, borderRadius: 18, alignItems: 'center' },
  primaryButton: { backgroundColor: '#7C3AED' },
  secondaryButton: { backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#333' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default GenerateScreen;
