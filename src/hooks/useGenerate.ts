import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { CLIPART_STYLES } from '../utils/constant/styles';

type StyleId = string;
type StyleResult = string | 'error' | null;

export const useGenerate = () => {
  // Results: a map of style ID to either the image URL, 'error', or null
  const [results, setResults] = useState<Record<StyleId, StyleResult>>({
    cartoon: null,
    flat: null,
    anime: null,
    pixel: null,
    sketch: null,
    '3d': null,
    minimalist: null,
    retro: null,
    graffiti: null,
  });

  // Loading: a map of style ID to boolean
  const [loading, setLoading] = useState<Record<StyleId, boolean>>({
    cartoon: false,
    flat: false,
    anime: false,
    pixel: false,
    sketch: false,
    '3d': false,
    minimalist: false,
    retro: false,
    graffiti: false,
  });

  const [hasStarted, setHasStarted] = useState(false);

  const generateStyle = async (imageBase64: string, styleId: string) => {
    try {
      // 1. Set individual style state to loading
      setLoading(prev => ({ ...prev, [styleId]: true }));
      setResults(prev => ({ ...prev, [styleId]: null }));

      // 2. Fire the specific style generation
      const imageUrl = await aiService.generateClipart(imageBase64, styleId);

      // 3. On success, store the URL
      setResults(prev => ({ ...prev, [styleId]: imageUrl }));
    } catch (error) {
      console.error(`Generation error for style: ${styleId}`, error);
      // 4. On failure, store 'error' status
      setResults(prev => ({ ...prev, [styleId]: 'error' }));
    } finally {
      // 5. Set individual loading to false
      setLoading(prev => ({ ...prev, [styleId]: false }));
    }
  };

  const generateAll = useCallback(async (imageBase64: string, selectedIds?: string[]) => {
    if (!imageBase64) return;
    
    setHasStarted(true);

    const targetStyles = selectedIds 
      ? CLIPART_STYLES.filter(s => selectedIds.includes(s.id))
      : CLIPART_STYLES;

    // Initial loading setup
    const initialLoading: Record<string, boolean> = {};
    const initialResults: Record<string, null> = {};
    targetStyles.forEach(style => {
      initialLoading[style.id] = true;
      initialResults[style.id] = null;
    });

    setLoading(initialLoading);
    setResults(initialResults);

    targetStyles.forEach((style, index) => {
      setTimeout(() => {
        generateStyle(imageBase64, style.id);
      }, index * 1000);
    });
  }, []);

  return {
    results,
    loading,
    generateAll,
    hasStarted,
  };
};
