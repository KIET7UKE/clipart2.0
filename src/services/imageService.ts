import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export const imageService = {
  /**
   * Helper to check if a result value is a valid image URL.
   */
  isValidResult: (result: string | 'error' | null): result is string => {
    return !!result && result !== 'error';
  },

  /**
   * Download a single image from a URL or Base64 and save it to the device's Pictures folder.
   */
  downloadImage: async (imageSource: string, styleName: string): Promise<boolean> => {
    try {
      // 1. Request Permission if Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'Grant storage access to save cliparts to your gallery.',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED && parseInt(Platform.Version.toString()) < 30) {
           throw new Error('Storage permission denied.');
        }
      }

      const timestamp = Date.now();
      const fileName = `clipart_${styleName.toLowerCase()}_${timestamp}.png`;
      
      const downloadPath = Platform.OS === 'android' 
        ? `${RNFS.DownloadDirectoryPath}/${fileName}` 
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // 2. Handle Base64 vs URL
      if (imageSource.startsWith('data:')) {
        const base64Data = imageSource.split(',')[1];
        await RNFS.writeFile(downloadPath, base64Data, 'base64');
        Alert.alert('Saved!', `Saved to downloads: ${fileName}`);
        return true;
      } else {
        const response = await RNFS.downloadFile({
          fromUrl: imageSource,
          toFile: downloadPath,
        }).promise;

        if (response.statusCode === 200) {
          Alert.alert('Saved!', `Saved to downloads: ${fileName}`);
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error('Download Image Error:', error);
      Alert.alert('Download Failed', error.message || 'Could not save the image.');
      return false;
    }
  },

  /**
   * Bulk download multiple images that are valid.
   */
  downloadAllImages: async (results: Record<string, any>): Promise<void> => {
    try {
      const validUris = Object.entries(results).filter(([_, val]) => 
        imageService.isValidResult(val)
      );

      if (validUris.length === 0) {
        Alert.alert('No Images', 'No generated images are available to download.');
        return;
      }

      let successCount = 0;
      for (const [styleId, imageSource] of validUris) {
        try {
          const fileName = `clipart_all_${styleId}_${Date.now()}.png`;
          const downloadPath = Platform.OS === 'android' 
            ? `${RNFS.DownloadDirectoryPath}/${fileName}` 
            : `${RNFS.DocumentDirectoryPath}/${fileName}`;

          if (imageSource.startsWith('data:')) {
            const base64Data = imageSource.split(',')[1];
            await RNFS.writeFile(downloadPath, base64Data, 'base64');
            successCount++;
          } else {
            const res = await RNFS.downloadFile({ fromUrl: imageSource, toFile: downloadPath }).promise;
            if (res.statusCode === 200) successCount++;
          }
        } catch (err) {
          console.error(`Failed to download ${styleId}:`, err);
        }
      }

      Alert.alert('Bulk Download Complete', `${successCount} images saved to Gallery/Downloads!`);
    } catch (error) {
       console.error('Download All Error:', error);
       Alert.alert('Error', 'An error occurred during bulk download.');
    }
  },

  /**
   * Share an image URL using the native share sheet.
   */
  shareImage: async (imageUrl: string): Promise<void> => {
    try {
      const options = {
        title: 'Share Clipart',
        url: imageUrl,
        type: 'image/png',
        failOnCancel: false,
      };
      
      await Share.open(options);
    } catch (error: any) {
      // User cancelled is not an error we show to them
      if (error && error.message && error.message.includes('User did not share')) {
        console.log('User cancelled share.');
        return;
      }
      console.error('Share Error:', error);
    }
  },
};
