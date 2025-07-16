import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "CACHE_";
const EXPIRATION_HOURS = 12;

const getCacheKey = (url: string) => `${CACHE_PREFIX}${url}`;

export const getCachedData = async (url: string) => {
  const key = getCacheKey(url);
  const value = await AsyncStorage.getItem(key);
  if (!value) return null;

  const { data, timestamp } = JSON.parse(value);
  const ageInHours = (Date.now() - timestamp) / (1000 * 60 * 60);

  if (ageInHours > EXPIRATION_HOURS) {
    await AsyncStorage.removeItem(key);
    return null;
  }

  return data;
};

export const setCachedData = async (url: string, data: any) => {
  const key = getCacheKey(url);
  const value = JSON.stringify({ data, timestamp: Date.now() });
  await AsyncStorage.setItem(key, value);
};
