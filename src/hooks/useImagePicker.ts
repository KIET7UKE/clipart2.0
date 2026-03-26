import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { 
  launchImageLibrary, 
  launchCamera, 
  ImagePickerResponse, 
  Asset 
} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

export interface PickedImage {
  uri: string;
  base64: string;
}

export const useImagePicker = () => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);

  const processImage = async (asset: Asset) => {
    try {
      setLoading(true);
      
      // 1. Validate Format
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!asset.type || !validFormats.includes(asset.type)) {
        Alert.alert('Invalid Format', 'Only JPG, PNG, and WEBP images are allowed.');
        return null;
      }

      let currentUri = asset.uri!;
      const fileSize = asset.fileSize || 0;
      const TWO_MB = 2 * 1024 * 1024;

      // 2. Compress if > 2MB
      if (fileSize > TWO_MB) {
        const resizedImage = await ImageResizer.createResizedImage(
          currentUri,
          1024,
          1024,
          'JPEG',
          80,
          0,
          undefined,
          false,
          { mode: 'contain', onlyScaleDown: true }
        );
        currentUri = resizedImage.uri;
      }

      // 3. Get Base64
      // We use RNFS to read the file as base64 to ensure we have it even after resizing
      const base64 = await RNFS.readFile(currentUri, 'base64');
      
      const picked: PickedImage = {
        uri: currentUri,
        base64: `data:image/jpeg;base64,${base64}`,
      };
      
      setImage(picked);
      return picked;
    } catch (error) {
      console.error('Image Processing Error:', error);
      Alert.alert('Error', 'Failed to process the selected image.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = useCallback(async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeExtra: true,
    });

    if (result.assets && result.assets[0]) {
      await processImage(result.assets[0]);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      includeExtra: true,
    });

    if (result.assets && result.assets[0]) {
      await processImage(result.assets[0]);
    }
  }, []);

  const clearImage = () => setImage(null);

  return {
    image,
    loading,
    pickFromGallery,
    takePhoto,
    clearImage,
  };
};
