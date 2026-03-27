import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Modal,
} from 'react-native';
import { Download, X } from 'lucide-react-native';
import { imageService } from '../../services/imageService';
import { useToast } from '../../components/ToastProvider';
import { aiService, ClipartHistory } from '../../services/aiService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft, RefreshCw, Share2, Palette } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/rootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';

import { Colors } from '../../utils/theme/DesignSystem';
import { SkeletonCard } from '../../components/SkeletonCard';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 64) / COLUMN_COUNT;

const HistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [history, setHistory] = useState<ClipartHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ClipartHistory | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Use fixed user ID for demo if no user object exists
  const userId = user?.id || 'demo_user_123';

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await aiService.getHistory(userId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, styleId: string) => {
    const success = await imageService.downloadImage(imageUrl, styleId);
    if (success) {
      showToast('Image saved to Gallery!');
    } else {
      showToast('Failed to save image', 'error');
    }
  };

  const handleShare = async (imageUrl: string) => {
    await imageService.shareImage(imageUrl);
  };

  const renderItem = ({ item }: { item: ClipartHistory }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedItem(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.cardOverlay}>
        <Text style={styles.styleLabel}>{item.styleId.toUpperCase()}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => handleShare(item.imageUrl)}>
            <Share2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.background, Colors.surfaceContainer]} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.headerSidePlaceholder} />
          <Text style={styles.title}>My Creations</Text>
          <View style={styles.headerSidePlaceholder} />
        </View>

        {loading && history.length === 0 ? (
          <View style={styles.listContent}>
            <View style={styles.loadingGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard
                  key={i}
                  width={ITEM_WIDTH}
                  height={ITEM_WIDTH * 1.2}
                  borderRadius={16}
                  style={{ margin: 8 }}
                />
              ))}
            </View>
          </View>
        ) : history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={COLUMN_COUNT}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 100 } // account for tab bar
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading && history.length > 0}
                onRefresh={fetchHistory}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
          />
        ) : (
          <View style={styles.emptyState}>
            <Palette size={80} color="#334155" />
            <Text style={styles.emptyText}>No creations yet.</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateArtScreen')}
            >
              <Text style={styles.createButtonText}>Start Creating</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Preview Modal */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setSelectedItem(null)}
        >
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { paddingTop: insets.top + 20 }]}>
              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                style={styles.modalCloseBtn}
              >
                <X color="#FFF" size={28} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedItem?.styleId.toUpperCase() || 'PREVIEW'}</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.modalImageContainer}>
              <Image
                source={{ uri: selectedItem?.imageUrl }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.modalFooter, { paddingBottom: insets.bottom + 20 }]}>
              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => selectedItem && handleShare(selectedItem.imageUrl)}
              >
                <Share2 color="#FFF" size={24} />
                <Text style={styles.modalActionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionBtn, styles.modalDownloadBtn]}
                onPress={() => selectedItem && handleDownload(selectedItem.imageUrl, selectedItem.styleId)}
              >
                <Download color="#000" size={24} />
                <Text style={[styles.modalActionText, { color: '#000' }]}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSidePlaceholder: {
    width: 40,
  },
  refreshButton: {
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    margin: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleLabel: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  modalActionBtn: {
    flex: 1,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalDownloadBtn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalActionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HistoryScreen;
