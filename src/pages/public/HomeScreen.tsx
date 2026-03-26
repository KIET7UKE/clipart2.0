import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { AnimatedButton } from '../../components/AnimatedButton';
import { StyleCarousel } from '../../components/StyleCarousel';
import { Colors, Layout, Gradients } from '../../utils/theme/DesignSystem';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleStartGenerating = () => {
    navigation.navigate('CreateArtScreen');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Subtle Glow Backdrop */}
        <View style={styles.glowBackdrop} />
        
        <View style={styles.container}>
          {/* Top Bar / App Identity */}
          <Animated.View entering={FadeIn.duration(800)} style={styles.topBar}>
            <View style={styles.sparkIcon}>
              <Text style={styles.sparkEmoji}>✨</Text>
            </View>
            <Text style={styles.appName}>Clipart <Text style={styles.accentText}>AI</Text></Text>
          </Animated.View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.heroTitle}>
              Turn your photos into stunning Clipart with AI
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={styles.heroSubtitle}>
              Fast, high-quality, and creative. Experience the power of AI artistry.
            </Animated.Text>

            {/* Glowing CTA Button */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.buttonWrapper}>
              <AnimatedButton
                style={styles.ctaButton}
                onPress={handleStartGenerating}
              >
                <LinearGradient
                  colors={Gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaButtonText}>Start Generating</Text>
                </LinearGradient>
              </AnimatedButton>
              <View style={styles.buttonGlow} />
            </Animated.View>
          </View>

          {/* Style Explorer Section */}
          <StyleCarousel />

          {/* Tips Section */}
          <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.tipsSection}>
             <View style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>Pro Tip</Text>
                <Text style={styles.tipsDesc}>Upload high-contrast photos for the best AI results.</Text>
             </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.background },
  glowBackdrop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primary,
    opacity: 0.05,
  },
  container: { flex: 1, paddingBottom: 40 },
  topBar: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sparkIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sparkEmoji: { fontSize: 20 },
  appName: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
  accentText: { color: Colors.primary },
  
  heroSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xxl,
    paddingBottom: Layout.spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
    maxWidth: '85%',
  },
  
  buttonWrapper: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  ctaButton: {
    width: '85%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  ctaGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonGlow: {
    position: 'absolute',
    width: '75%',
    height: 30,
    bottom: -10,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    borderRadius: 20,
    zIndex: -1,
  },
  
  tipsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
  },
  tipsCard: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Layout.spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipsTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tipsDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

export default HomeScreen;
