import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Dimensions, 
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Sparkles,
  ChevronLeft 
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { Colors, Layout, Gradients } from '../../utils/theme/DesignSystem';
import { AnimatedButton } from '../../components/AnimatedButton';
import { imageService } from '../../services/imageService';
import { CLIPART_STYLES } from '../../utils/constant/styles';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import { useToast } from '../../components/ToastProvider';

const { width } = Dimensions.get('window');

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'ResultScreen'>;

const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { images = [], originalImage } = route.params || {};
  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);

  const currentImage = images[currentIndex] || '';

  const handleDownload = async () => {
    const success = await imageService.downloadImage(currentImage, `Clipart_${currentIndex}`);
    if (success) {
      showToast('Magic art saved to your gallery!');
    } else {
      showToast('Failed to save image', 'error');
    }
  };

  const handleShare = async () => {
    await imageService.shareImage(currentImage);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
           <ChevronLeft color={Colors.text} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Masterpiece</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Preview with Before/After Slider */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.previewCard}>
           {originalImage ? (
             <BeforeAfterSlider 
               beforeUri={originalImage} 
               afterUri={currentImage} 
               height={width * 1.1} 
             />
           ) : (
             <Image 
               source={{ uri: currentImage }} 
               style={styles.mainImage} 
               resizeMode="cover"
             />
           )}
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
           <AnimatedButton style={styles.shareBtn} onPress={handleShare}>
              <View style={styles.btnContent}>
                 <Share2 color={Colors.text} size={20} />
                 <Text style={styles.btnText}>Share</Text>
              </View>
           </AnimatedButton>
           
           <AnimatedButton style={styles.downloadBtn} onPress={handleDownload}>
              <LinearGradient 
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.downloadGradient}
              >
                 <Download color="#000" size={20} />
                 <Text style={styles.downloadText}>Download</Text>
              </LinearGradient>
           </AnimatedButton>
        </View>

        {/* Alternative Styles Grid */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>More Variations</Text>
           <View style={styles.altGrid}>
              {images.map((img, idx) => (
                <TouchableOpacity 
                  key={idx}
                  onPress={() => {
                    setCurrentIndex(idx);
                    setShowOriginal(false);
                  }}
                  style={[styles.altCard, currentIndex === idx && styles.altCardSelected]}
                >
                   <Image source={{ uri: img }} style={styles.altImage} />
                   <View style={styles.altOverlay}>
                      <Text style={styles.altLabel}>{CLIPART_STYLES[idx]?.label || 'Clipart'}</Text>
                   </View>
                </TouchableOpacity>
              ))}
           </View>
        </View>

        <TouchableOpacity 
          style={styles.restartBtn}
          onPress={() => navigation.navigate('HomeScreen')}
        >
           <Sparkles color={Colors.primary} size={18} style={{ marginRight: 8 }} />
           <Text style={styles.restartText}>Create New Magic</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.background },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backEmoji: { fontSize: 24, color: Colors.text },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  
  scrollContent: { padding: Layout.spacing.lg },
  previewCard: {
    width: '100%',
    height: width * 1.1,
    borderRadius: 32,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mainImage: { width: '100%', height: '100%' },
  toggleBadge: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleText: { color: Colors.text, fontSize: 12, fontWeight: 'bold' },
  
  actionRow: { flexDirection: 'row', marginTop: Layout.spacing.xl, gap: 12 },
  shareBtn: { flex: 1, height: 56, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  downloadBtn: { flex: 1.5, height: 56, borderRadius: 28, overflow: 'hidden' },
  downloadGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnEmoji: { fontSize: 18 },
  btnText: { color: Colors.text, fontWeight: 'bold' },
  downloadText: { color: '#000', fontWeight: 'bold' },
  
  section: { marginTop: Layout.spacing.xxl },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  altGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  altCard: { width: (width - Layout.spacing.lg * 2 - 12) / 2, height: width * 0.45, borderRadius: 20, overflow: 'hidden', backgroundColor: Colors.surfaceContainerHigh },
  altCardSelected: { borderWidth: 2, borderColor: Colors.primary },
  altImage: { width: '100%', height: '100%' },
  altOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  altLabel: { color: Colors.text, fontSize: 11, fontWeight: 'bold' },
  
  restartBtn: { marginTop: 32, width: '100%', height: 56, borderRadius: 28, backgroundColor: Colors.surfaceContainerLow, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary },
  restartText: { color: Colors.primary, fontWeight: 'bold', fontSize: 16 },
});

export default ResultScreen;
