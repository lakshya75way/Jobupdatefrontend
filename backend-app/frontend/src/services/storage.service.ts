export enum StorageKey {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  USER = "user",
}

class StorageService {
  public getItem<T>(key: StorageKey): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  public setItem(key: StorageKey, value: unknown): void {
    const valueToStore =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
  }

  public removeItem(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public getAccessToken(): string | null {
    return this.getItem<string>(StorageKey.ACCESS_TOKEN);
  }

  public getRefreshToken(): string | null {
    return this.getItem<string>(StorageKey.REFRESH_TOKEN);
  }
}

export const storageService = new StorageService();
