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
  SafeAreaView,
  Share,
} from 'react-native';
import { aiService, ClipartHistory } from '../../services/aiService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeft, RefreshCw, Share2, Palette } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 48) / COLUMN_COUNT;

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<ClipartHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<any>();

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
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E293B']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>My Creations</Text>
          <TouchableOpacity onPress={fetchHistory} style={styles.refreshButton}>
            <RefreshCw size={24} color="#38BDF8" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={styles.emptyText}>Loading your art gallery...</Text>
          </View>
        ) : history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={COLUMN_COUNT}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Palette size={80} color="#334155" />
            <Text style={styles.emptyText}>No creations yet.</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('HomeScreen')}
            >
              <Text style={styles.createButtonText}>Start Creating</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#38BDF8',
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
    backgroundColor: '#38BDF8',
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
