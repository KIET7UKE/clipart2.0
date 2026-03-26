import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share,
  RefreshControl,
} from 'react-native';
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

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

const HistoryScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<ClipartHistory[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleShare = async (imageUrl: string) => {
    try {
      await Share.share({
        message: 'Check out this AI-generated clipart I created!',
        url: imageUrl,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  const renderItem = ({ item }: { item: ClipartHistory }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ResultScreen', { imageUrl: item.imageUrl, fromHistory: true })}
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
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.emptyText}>Loading your art gallery...</Text>
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
});

export default HistoryScreen;
