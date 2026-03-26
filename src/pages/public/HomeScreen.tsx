import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Sparkles, Zap, Wand, Clock } from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { AnimatedButton } from '../../components/AnimatedButton';
import { StyleCarousel } from '../../components/StyleCarousel';
import { Colors, Layout, Gradients } from '../../utils/theme/DesignSystem';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainTabs'
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

      {/* Fixed Top Bar */}
      <Animated.View entering={FadeIn.duration(800)} style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.sparkIcon}>
            <Sparkles color={Colors.primary} size={20} />
          </View>
          <Text style={styles.appName}>Clipart <Text style={styles.accentText}>AI</Text></Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Subtle Glow Backdrop */}
        <View style={styles.glowBackdrop} />

        <View style={styles.container}>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.trendingBadge}>
              <Sparkles color={Colors.primary} size={12} fill={Colors.primary} />
              <Text style={styles.trendingText}>NEW: V3 ENGINE LIVE</Text>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.heroTitle}>
              Turn your photos into stunning <Text style={styles.accentText}>Clipart</Text>
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={styles.heroSubtitle}>
              Experience the next-gen AI artistry. Fast, high-quality, and creative.
            </Animated.Text>

            {/* Glowing CTA Button */}
            <Animated.View entering={FadeInDown.delay(600).duration(800)} style={styles.buttonWrapper}>
              <AnimatedButton
                style={styles.ctaButton}
                onPress={handleStartGenerating}
              >
                <LinearGradient
                  colors={['#D095FF', '#9E4DFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaButtonText}>Start Generating</Text>
                  <View style={styles.zapIcon}>
                    <Zap color="#fff" size={18} fill="#fff" />
                  </View>
                </LinearGradient>
              </AnimatedButton>
              <View style={styles.buttonShadow} />
            </Animated.View>
          </View>

          {/* Style Explorer Section */}
          <StyleCarousel />

          {/* Tips Section */}
          <Animated.View entering={FadeInDown.delay(800).duration(800)} style={styles.tipsSection}>
            <View style={styles.tipsCard}>
              <View style={styles.tipHeader}>
                <Wand color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                <Text style={styles.tipsTitle}>Pro Tip</Text>
              </View>
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
  container: { flex: 1, paddingBottom: 60 },
  topBar: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background, // Match background for a seamless look
  },
  sparkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  appName: { fontSize: 24, fontWeight: 'bold', color: Colors.text, letterSpacing: -0.5 },
  accentText: { color: Colors.primary },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  heroSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.xl,
    alignItems: 'center',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(208, 149, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(208, 149, 255, 0.2)',
  },
  trendingText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -1,
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
    width: '90%',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  ctaGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  zapIcon: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonShadow: {
    position: 'absolute',
    width: '70%',
    height: 20,
    bottom: -5,
    backgroundColor: Colors.primary,
    opacity: 0.1,
    borderRadius: 30,
    zIndex: -1,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },

  tipsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
  },
  recentSection: {
    marginTop: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  sectionHeader: {
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  recentList: {
    paddingRight: Layout.spacing.lg,
    gap: 12,
  },
  recentItem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  recentImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  recentBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  tipsCard: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Layout.spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tipsTitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tipsDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

export default HomeScreen;
