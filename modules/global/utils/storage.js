import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const WEB_TOKEN_KEY_PREFIX = 'collabnex_';

export const storage = {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web' && globalThis?.localStorage) {
        globalThis.localStorage.setItem(WEB_TOKEN_KEY_PREFIX + key, value);
      } else {
        await SecureStore.setItemAsync(key, value, { keychainService: 'collabnex' });
      }
    } catch (e) {
      console.warn('Storage setItem failed:', e);
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web' && globalThis?.localStorage) {
        return globalThis.localStorage.getItem(WEB_TOKEN_KEY_PREFIX + key);
      }
      return await SecureStore.getItemAsync(key, { keychainService: 'collabnex' });
    } catch (e) {
      console.warn('Storage getItem failed:', e);
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web' && globalThis?.localStorage) {
        globalThis.localStorage.removeItem(WEB_TOKEN_KEY_PREFIX + key);
      } else {
        await SecureStore.deleteItemAsync(key, { keychainService: 'collabnex' });
      }
    } catch (e) {
      console.warn('Storage removeItem failed:', e);
    }
  },
};
