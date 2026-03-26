import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming, 
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import { useImagePicker } from '../../hooks/useImagePicker';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { AnimatedButton } from '../../components/AnimatedButton';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { image, loading, pickFromGallery, takePhoto, clearImage } = useImagePicker();

  // 1. Pulsing Border Animation for Upload Card
  const pulseValue = useSharedValue(1);
  useEffect(() => {
    if (!image) {
      pulseValue.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(1);
    }
  }, [image]);

  const animatedBorder = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    borderColor: interpolate(pulseValue.value, [1, 1.05], [0x7C3AED, 0xAF87FF]) as any, // Simple interp or manual color
  }));

  // 2. Shimmer Animation for the Generate Button
  const shimmerValue = useSharedValue(-width);
  useEffect(() => {
    if (image) {
      shimmerValue.value = withRepeat(withTiming(width, { duration: 1500 }), -1);
    }
  }, [image]);

  const animatedShimmer = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerValue.value }],
  }));

  const handleGenerate = () => {
    if (image) {
      navigation.navigate('GenerateScreen', { selectedImage: image.base64 });
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 3. Subtle Purple Gradient Background */}
      <LinearGradient 
        colors={['rgba(124, 58, 237, 0.15)', 'transparent']} 
        style={styles.backgroundGradient} 
      />

      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>ClipArt <Text style={styles.accentText}>AI</Text></Text>
          <Text style={styles.subtitle}>Transform yourself into art</Text>
        </View>

        {/* Upload Card Area */}
        <View style={styles.cardContainer}>
          <Animated.View style={[
              styles.uploadCard, 
              image && styles.uploadCardActive,
              !image && animatedBorder
          ]}>
            {image ? (
              <Animated.View entering={FadeIn.duration(600)} style={styles.previewContainer}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
              </Animated.View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.iconContainer}><Text style={styles.icon}>↑</Text></View>
                <Text style={styles.uploadText}>Tap to upload photo</Text>
              </View>
            )}
            {loading && <View style={styles.loadingOverlay}><ActivityIndicator color="#7C3AED" size="large" /></View>}
          </Animated.View>

          {!image ? (
            <View style={styles.buttonRow}>
              <AnimatedButton style={styles.actionButton} onPress={takePhoto}>
                <Text style={styles.buttonText}>Camera</Text>
              </AnimatedButton>
              <AnimatedButton style={styles.actionButton} onPress={pickFromGallery}>
                <Text style={styles.buttonText}>Gallery</Text>
              </AnimatedButton>
            </View>
          ) : (
             <View style={styles.generateContainer}>
                <AnimatedButton 
                  style={styles.generateButton} 
                  onPress={handleGenerate}
                >
                  <View style={styles.shimmerWrapper}>
                    <Animated.View style={[styles.shimmer, animatedShimmer]}>
                      <LinearGradient 
                        colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']} 
                        start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                        style={StyleSheet.absoluteFill}
                      />
                    </Animated.View>
                  </View>
                  <Text style={styles.generateButtonText}>Generate Cliparts</Text>
                </AnimatedButton>
                <AnimatedButton onPress={clearImage} style={styles.changePhotoLink}>
                   <Text style={styles.changePhotoText}>Change photo</Text>
                </AnimatedButton>
             </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0D0D0D' },
  backgroundGradient: { ...StyleSheet.absoluteFillObject, height: 300 },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { fontSize: 44, fontWeight: '900', color: '#FFF' },
  accentText: { color: '#7C3AED' },
  subtitle: { fontSize: 16, color: '#A0A0A0', marginTop: 8, fontWeight: '500' },
  cardContainer: { width: '100%', alignItems: 'center' },
  uploadCard: { width: '100%', height: 320, borderRadius: 24, borderWidth: 2, borderColor: '#7C3AED', borderStyle: 'dashed', backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 24 },
  uploadCardActive: { borderStyle: 'solid' },
  emptyState: { alignItems: 'center' },
  iconContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: '#7C3AED', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  icon: { fontSize: 32, color: '#7C3AED' },
  uploadText: { fontSize: 16, color: '#FFF', fontWeight: '600' },
  previewContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%' },
  buttonRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  actionButton: { flex: 0.48, backgroundColor: '#1A1A1A', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  generateContainer: { width: '100%', alignItems: 'center' },
  generateButton: { width: '100%', height: 56, backgroundColor: '#7C3AED', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  shimmerWrapper: { ...StyleSheet.absoluteFillObject },
  shimmer: { width: 150, height: '100%', pointerEvents: 'none' },
  generateButtonText: { color: '#FFF', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  changePhotoLink: { padding: 10, marginTop: 10 },
  changePhotoText: { color: '#A0A0A0', textDecorationLine: 'underline' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
