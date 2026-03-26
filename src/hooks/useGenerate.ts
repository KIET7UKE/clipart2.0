import { useState, useCallback, useRef } from 'react';
import { aiService } from '../services/aiService';
import { CLIPART_STYLES } from '../utils/constant/styles';

type StyleId = string;
type StyleResult = string | 'error' | null;

export const useGenerate = () => {
  const [results, setResults] = useState<Record<StyleId, StyleResult>>({});
  const [loading, setLoading] = useState<Record<StyleId, boolean>>({});
  const [hasStarted, setHasStarted] = useState(false);

  // Store params so retry can re-use them
  const imageRef = useRef<string>('');
  const customPromptRef = useRef<string | undefined>(undefined);
  const intensityRef = useRef<number>(3);
  const userIdRef = useRef<string | undefined>(undefined);

  const generateStyle = useCallback(async (
    imageBase64: string,
    styleId: string,
    customPrompt?: string,
    styleIntensity: number = 3,
    userId?: string,
  ) => {
    try {
      setLoading(prev => ({ ...prev, [styleId]: true }));
      setResults(prev => ({ ...prev, [styleId]: null }));

      const imageUrl = await aiService.generateClipart(
        imageBase64,
        styleId,
        customPrompt,
        styleIntensity,
        userId,
      );

      setResults(prev => ({ ...prev, [styleId]: imageUrl }));
    } catch (error) {
      console.error(`Generation error for style: ${styleId}`, error);
      setResults(prev => ({ ...prev, [styleId]: 'error' }));
    } finally {
      setLoading(prev => ({ ...prev, [styleId]: false }));
    }
  }, []);

  const generateAll = useCallback(
    async (
      imageBase64: string,
      selectedIds?: string[],
      customPrompt?: string,
      styleIntensity: number = 3,
      userId?: string,
    ) => {
      if (!imageBase64) return;

      imageRef.current = imageBase64;
      customPromptRef.current = customPrompt;
      intensityRef.current = styleIntensity;
      userIdRef.current = userId;
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

      // Stagger API calls to avoid overwhelming the backend/rate limits
      targetStyles.forEach((style, index) => {
        setTimeout(() => {
          generateStyle(imageBase64, style.id, customPrompt, styleIntensity, userId);
        }, index * 1200);
      });
    },
    [generateStyle],
  );

  const retryStyle = useCallback(
    (styleId: string) => {
      if (!imageRef.current) return;
      generateStyle(
        imageRef.current,
        styleId,
        customPromptRef.current,
        intensityRef.current,
        userIdRef.current,
      );
    },
    [generateStyle],
  );

  return {
    results,
    loading,
    generateAll,
    retryStyle,
    hasStarted,
  };
};
