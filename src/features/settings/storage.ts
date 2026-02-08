/**
 * Storage wrapper:
 * - Uses AsyncStorage if present
 * - Falls back to in-memory storage if AsyncStorage isn't installed
 *
 * This lets the feature compile even if your app uses a different persistence layer.
 * For full persistence, install: @react-native-async-storage/async-storage
 */
type AnyStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const memory = new Map<string, string>();

function createMemoryStorage(): AnyStorage {
  return {
    async getItem(key) {
      return memory.has(key) ? memory.get(key)! : null;
    },
    async setItem(key, value) {
      memory.set(key, value);
    },
    async removeItem(key) {
      memory.delete(key);
    },
  };
}

function loadAsyncStorage(): AnyStorage | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@react-native-async-storage/async-storage");
    const as = mod?.default ?? mod;
    if (as?.getItem && as?.setItem && as?.removeItem) return as as AnyStorage;
    return null;
  } catch {
    return null;
  }
}

export const storage: AnyStorage = loadAsyncStorage() ?? createMemoryStorage();

export async function readJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await storage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await storage.removeItem(key);
}
