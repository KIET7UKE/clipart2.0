import React from 'react';
import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { StyleCard } from './StyleCard';
import { CLIPART_STYLES, ClipartStyle } from '../utils/constant/styles';

interface Props {
  results: Record<string, string | 'error' | null>;
  loading: Record<string, boolean>;
  onRetry: (style: ClipartStyle) => void;
}

export const ResultGrid: React.FC<Props> = ({ results, loading, onRetry }) => {
  const renderItem: ListRenderItem<ClipartStyle> = ({ item, index }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 150).duration(500).springify()}
      style={styles.itemWrapper}
    >
      <StyleCard 
        style={item}
        loading={loading[item.id]}
        result={results[item.id]}
        onRetry={() => onRetry(item)}
        index={index}
      />
    </Animated.View>
  );

  const filteredStyles = CLIPART_STYLES.filter(s => results.hasOwnProperty(s.id));

  return (
    <FlatList
      data={filteredStyles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120, // push list up for bottom bar
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemWrapper: {
    marginBottom: 0,
  },
});
