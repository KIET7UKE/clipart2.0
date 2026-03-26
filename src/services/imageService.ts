import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export const imageService = {
  /**
   * Helper to check if a result value is a valid image URL (Base64 or Link).
   */
  isValidResult: (result: string | 'error' | null): result is string => {
    return !!result && result !== 'error';
  },

  /**
   * Request necessary storage permissions for Android.
   */
  requestPermissions: async () => {
    if (Platform.OS !== 'android') return true;

    try {
      // For Android 13+ (API 33), we need READ_MEDIA_IMAGES
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          'android.permission.READ_MEDIA_IMAGES' as any
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // For Android < 13
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  },

  /**
   * Download a single image (Base64 or URL) and ensure it shows in Gallery.
   */
  downloadImage: async (imageSource: string, styleName: string): Promise<boolean> => {
    try {
      const hasPermission = await imageService.requestPermissions();
      if (!hasPermission && Platform.OS === 'android' && Platform.Version < 30) {
        Alert.alert('Permission Denied', 'Storage access is required to save photos.');
        return false;
      }

      const fileName = `Clipart_${styleName.replace(/\s+/g, '')}_${Date.now()}.png`;
      
      // Save to Pictures instead of Downloads for better Gallery visibility
      const dirPath = Platform.OS === 'android' 
        ? `${RNFS.ExternalStorageDirectoryPath}/Pictures/Clipart`
        : `${RNFS.DocumentDirectoryPath}/Clipart`;

      // Ensure directory exists
      await RNFS.mkdir(dirPath);
      const filePath = `${dirPath}/${fileName}`;

      // Handle Base64
      if (imageSource.startsWith('data:')) {
        const base64Data = imageSource.split('base64,')[1];
        await RNFS.writeFile(filePath, base64Data, 'base64');
      } else {
        // Handle URL
        await RNFS.downloadFile({
          fromUrl: imageSource,
          toFile: filePath,
        }).promise;
      }

      // CRITICAL: Scan the file so it appears in Gallery immediately on Android
      if (Platform.OS === 'android') {
        await RNFS.scanFile(filePath);
      }

      Alert.alert('Success!', 'Image saved to your Gallery.');
      return true;
    } catch (error: any) {
      console.error('Download Image Error:', error);
      Alert.alert('Save Failed', 'Could not save image to gallery. Please check permissions.');
      return false;
    }
  },

  /**
   * Share an image. Saves to cache first to ensure reliability with large Base64.
   */
  shareImage: async (imageSource: string): Promise<void> => {
    try {
      let shareUrl = imageSource;

      // For large Base64, save to a temp file first (more reliable for sharing)
      if (imageSource.startsWith('data:')) {
        const tempPath = `${RNFS.CachesDirectoryPath}/shared_image_${Date.now()}.png`;
        const base64Data = imageSource.split('base64,')[1];
        await RNFS.writeFile(tempPath, base64Data, 'base64');
        shareUrl = `file://${tempPath}`;
      }

      const options = {
        title: 'Check out my AI Clipart!',
        url: shareUrl,
        type: 'image/png',
      };
      
      await Share.open(options);
    } catch (error: any) {
      if (error && error.message && error.message.includes('User did not share')) return;
      console.error('Share Error:', error);
      Alert.alert('Share Failed', 'Could not open share menu.');
    }
  },

  /**
   * Bulk download multiple valid images.
   */
  downloadAllImages: async (results: Record<string, string | 'error' | null>): Promise<void> => {
    const validUris = Object.entries(results).filter(([_, val]) => 
      imageService.isValidResult(val)
    ) as [string, string][];

    if (validUris.length === 0) {
      Alert.alert('Notice', 'No ready images to download.');
      return;
    }

    let successCount = 0;
    for (const [styleId, source] of validUris) {
      const success = await imageService.downloadImage(source, styleId);
      if (success) successCount++;
    }

    if (successCount > 0) {
      Alert.alert('Batch Save', `${successCount} images saved to Gallery.`);
    }
  },
};
