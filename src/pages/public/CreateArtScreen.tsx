import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Image as ImageIcon,
  Camera,
  Trash2,
  Wand2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react-native';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { AnimatedButton } from '../../components/AnimatedButton';
import { Colors, Layout, Gradients } from '../../utils/theme/DesignSystem';
import { useImagePicker } from '../../hooks/useImagePicker';
import { CLIPART_STYLES } from '../../utils/constant/styles';
import { StyleOptionCard } from '../../components/StyleOptionCard';

const { width } = Dimensions.get('window');

type CreateArtNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateArtScreen'
>;

const CreateArtScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CreateArtNavigationProp>();
  const { image, loading, pickFromGallery, takePhoto, clearImage } =
    useImagePicker();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  const isButtonDisabled = !image || selectedStyles.length === 0;
  const allSelected = selectedStyles.length === CLIPART_STYLES.length;

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId],
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedStyles([]);
    } else {
      setSelectedStyles(CLIPART_STYLES.map(s => s.id));
    }
  };

  const handleGenerate = () => {
    if (!image) {
      Alert.alert('Selection Required', 'Please upload a photo first.');
      return;
    }
    if (selectedStyles.length === 0) {
      Alert.alert('Style Required', 'Please select at least one style.');
      return;
    }

    navigation.navigate('GenerateScreen', {
      selectedImage: image.base64,
      styles: selectedStyles,
      customPrompt: customPrompt.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft color={Colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Art</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 150 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>1. Upload your photo</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={image ? undefined : pickFromGallery}
            style={[styles.uploadArea, image && styles.uploadAreaActive]}
          >
            {image ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.previewImage}
                />
                <TouchableOpacity
                  onPress={clearImage}
                  style={styles.removeButton}
                >
                  <Trash2 color="#FFF" size={16} />
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyUpload}>
                <View style={styles.uploadIconCircle}>
                  <ImageIcon color={Colors.primary} size={32} />
                </View>
                <Text style={styles.uploadMainText}>Tap to add photo</Text>
                <Text style={styles.uploadSubText}>
                  Keep face clear for best results
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {!image && (
            <View style={styles.quickActions}>
              <TouchableOpacity onPress={takePhoto} style={styles.quickBtn}>
                <Camera color={Colors.primary} size={18} />
                <Text style={styles.quickBtnText}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Step 2: Select Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>2. Select Styles to Brew</Text>
            <TouchableOpacity
              onPress={handleSelectAll}
              style={styles.countBadge}
            >
              <Text style={styles.countText}>
                {allSelected
                  ? 'Deselect All'
                  : selectedStyles.length > 0
                  ? `${selectedStyles.length} Selected`
                  : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.styleGrid}>
            {CLIPART_STYLES.map(style => (
              <StyleOptionCard
                key={style.id}
                style={style}
                isSelected={selectedStyles.includes(style.id)}
                onSelect={() => toggleStyle(style.id)}
              />
            ))}
          </View>
        </View>

        {/* Step 3: Prompt Customization (Bonus) */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.promptToggle}
            onPress={() => setShowPromptEditor(v => !v)}
            activeOpacity={0.8}
          >
            <View style={styles.promptToggleLeft}>
              <Sparkles color={Colors.primary} size={16} />
              <Text style={styles.promptToggleText}>
                Prompt Customization
              </Text>
              <View style={styles.promptBonusBadge}>
                <Text style={styles.promptBonusBadgeText}>BONUS</Text>
              </View>
            </View>
            {showPromptEditor ? (
              <ChevronUp color={Colors.textSecondary} size={18} />
            ) : (
              <ChevronDown color={Colors.textSecondary} size={18} />
            )}
          </TouchableOpacity>

          {showPromptEditor && (
            <View style={styles.promptEditorWrap}>
              <Text style={styles.promptHint}>
                Add extra descriptors to personalize your art (e.g. "wearing
                sunglasses", "in space", "holding a sword")
              </Text>
              <TextInput
                style={styles.promptInput}
                placeholder="e.g. wearing a crown, in space…"
                placeholderTextColor={Colors.textSecondary}
                value={customPrompt}
                onChangeText={setCustomPrompt}
                maxLength={120}
                multiline
                numberOfLines={2}
              />
              <Text style={styles.charCount}>{customPrompt.length}/120</Text>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Generation Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 20),
            height: 80 + insets.bottom,
          },
        ]}
      >
        <AnimatedButton
          disabled={isButtonDisabled}
          style={styles.generateBtn}
          onPress={handleGenerate}
        >
          <LinearGradient
            colors={
              isButtonDisabled ? ['#2A2A2A', '#1A1A1A'] : Gradients.primary
            }
            style={styles.btnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.btnContent}>
              <Wand2
                color={isButtonDisabled ? '#555' : '#000'}
                size={20}
                style={{ marginRight: 10 }}
              />
              <Text
                style={[
                  styles.generateText,
                  isButtonDisabled && { color: '#555' },
                ]}
              >
                {selectedStyles.length > 1
                  ? `Brew ${selectedStyles.length} Styles`
                  : 'Brew Art Magic'}
              </Text>
            </View>
          </LinearGradient>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  scrollContent: { paddingHorizontal: Layout.spacing.lg, paddingBottom: 40 },
  section: { marginTop: Layout.spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    paddingBottom: 16,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(208, 149, 255, 0.2)',
  },
  countText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' },

  uploadArea: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(208, 149, 255, 0.3)',
    borderStyle: 'dashed',
    backgroundColor: Colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadAreaActive: {
    borderStyle: 'solid',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  emptyUpload: { alignItems: 'center' },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(208, 149, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadMainText: { color: Colors.text, fontSize: 17, fontWeight: 'bold' },
  uploadSubText: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  previewContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  removeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  quickActions: { marginTop: 16, alignItems: 'center' },
  quickBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  quickBtnText: { color: Colors.primary, fontWeight: 'bold', fontSize: 15 },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Prompt Editor
  promptToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(208, 149, 255, 0.15)',
  },
  promptToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptToggleText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  promptBonusBadge: {
    backgroundColor: 'rgba(208, 149, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  promptBonusBadgeText: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  promptEditorWrap: {
    marginTop: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(208, 149, 255, 0.15)',
  },
  promptHint: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  promptInput: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: 12,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  charCount: {
    color: Colors.textSecondary,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.lg,
    paddingBottom: 40,
    backgroundColor: 'rgba(14, 14, 14, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  generateBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  generateText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
});

export default CreateArtScreen;
