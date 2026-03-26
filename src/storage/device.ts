import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFromStore = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (e) {
    console.log('Error reading from storage', e);
    return null;
  }
};

export const setStore = async ({key, value}: {key: string; value: any}) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log('Error writing to storage', e);
  }
};

export const removeFromStore = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('Error removing from storage', e);
  }
};
