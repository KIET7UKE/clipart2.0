import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, Image, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../../utils/constant/theme';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { imageService } from '../../services/imageService';

type ResultScreenRoute = RouteProp<RootStackParamList, 'ResultScreen'>;

const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRoute>();
  const navigation = useNavigation();
  const { images, prompt } = route.params;

  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (uri: string) => {
    try {
      setSaving(true);
      const styleName = 'downloaded';
      const success = await imageService.downloadImage(uri, styleName);
      if (!success) {
        Alert.alert('Error', 'Failed to save image.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async (uri: string) => {
    try {
       await imageService.shareImage(uri);
    } catch (err) {
       console.error('Share Error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Results for:</Text>
          <Text style={styles.prompt} numberOfLines={2}>"{prompt}"</Text>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {images.map((uri: string, idx: number) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => setSelectedImage(uri)}
                  style={{ width: '48%', marginBottom: 15 }}
                >
                  <Image source={{ uri }} style={{ width: '100%', height: 150, borderRadius: 12 }} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Action Modal */}
        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <View style={styles.modalBg}>
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedImage(null)} />
            <View style={styles.modalContent}>
              {selectedImage && (
                <>
                  <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.modalButton} 
                      onPress={() => handleSave(selectedImage)}
                      disabled={saving}
                    >
                      {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalButtonText}>Download</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.modalButtonSecondary]} 
                      onPress={() => handleShare(selectedImage)}
                    >
                      <Text style={styles.modalButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Generate More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    padding: THEME.spacing.md,
  },
  header: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
  },
  prompt: {
    color: THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  backButton: {
    marginVertical: THEME.spacing.lg,
    alignSelf: 'center',
    padding: THEME.spacing.md,
  },
  backButtonText: {
    color: THEME.colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: 300,
    borderRadius: THEME.borderRadius.md,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: THEME.spacing.xl,
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 0.48,
    backgroundColor: THEME.colors.accent,
    height: 48,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: THEME.colors.border,
  },
  modalButtonText: {
    color: THEME.colors.text.primary,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
