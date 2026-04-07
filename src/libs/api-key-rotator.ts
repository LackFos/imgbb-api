import { type RedisClient } from "@/libs/redis-client";

interface ApiKey {
  key: string;
  usage_count: number;
  expired_at: string | null;
}

export class ApiKeyRotator {
  constructor(private redisClient: RedisClient) {}

  async getCurrentApiKey(): Promise<ApiKey | null> {
    const apiKeys = await this.getApiKeyFromRedis();
    const activeIndex = await this.getActiveApiKeyIndexFromRedis();

    // If no API keys are found, initialize with default keys
    if (apiKeys.length === 0) {
      return await this.setDefaultApiKeys();
    }

    return apiKeys[activeIndex] || null;
  }

  async rotateApiKey(): Promise<ApiKey | null> {
    const activeIndex = await this.getActiveApiKeyIndexFromRedis();
    const apiKeys = await this.getApiKeyFromRedis();

    // If no API keys are found, initialize with default keys
    if (apiKeys.length === 0 || apiKeys.length <= activeIndex) {
      return await this.setDefaultApiKeys();
    }

    // Rotate to the next API key in a round-robin fashion
    const nextIndex = (activeIndex + 1) % apiKeys.length;

    // If cycling back to start, reset all expired_at values
    const isFullCycle = nextIndex === 0;

    const updatedApiKeys = apiKeys.map((key, index) => {
      if (isFullCycle) {
        // Reset all keys on full cycle
        return { ...key, expired_at: null };
      }

      if (index === activeIndex) {
        return { ...key, expired_at: new Date().toISOString() };
      }

      return key;
    });

    await this.setApiKeysInRedis(updatedApiKeys);
    await this.setActiveApiKeyIndexInRedis(nextIndex);

    return updatedApiKeys[nextIndex];
  }

  async incrementUsageCount(): Promise<void> {
    const activeIndex = await this.getActiveApiKeyIndexFromRedis();
    const apiKeys = await this.getApiKeyFromRedis();

    if (apiKeys.length === 0 || apiKeys.length <= activeIndex) {
      return;
    }

    const updatedApiKeys = apiKeys.map((key, index) => {
      if (index === activeIndex) {
        return { ...key, usage_count: key.usage_count + 1 };
      }

      return key;
    });

    await this.setApiKeysInRedis(updatedApiKeys);
  }

  private async setDefaultApiKeys(): Promise<ApiKey> {
    const apiKeyList = process.env.IMGBB_API_KEYS?.split(",").map((key) =>
      key.trim(),
    );

    if (!apiKeyList || apiKeyList.length === 0) {
      throw new Error("No IMGBB API keys found in environment variables");
    }

    const apiKeys: ApiKey[] = apiKeyList.map((key) => ({
      key,
      usage_count: 0,
      expired_at: null,
    }));

    await this.setApiKeysInRedis(apiKeys);
    await this.setActiveApiKeyIndexInRedis(0);

    // Return the first API key as the active key
    return apiKeys[0];
  }

  private async getActiveApiKeyIndexFromRedis(): Promise<number> {
    const index = await this.redisClient.get(
      `${process.env.REDIS_PREFIX}active_api_key_index`,
    );

    return index ? parseInt(index, 10) : 0;
  }

  private async getApiKeyFromRedis(): Promise<ApiKey[]> {
    const storedApiKeys = await this.redisClient.get(
      `${process.env.REDIS_PREFIX}api_keys`,
    );

    if (!storedApiKeys) return [];

    return JSON.parse(storedApiKeys);
  }

  private async setApiKeysInRedis(apiKeys: ApiKey[]): Promise<void> {
    await this.redisClient.set(
      `${process.env.REDIS_PREFIX}api_keys`,
      JSON.stringify(apiKeys),
    );
  }

  private async setActiveApiKeyIndexInRedis(index: number): Promise<void> {
    await this.redisClient.set(
      `${process.env.REDIS_PREFIX}active_api_key_index`,
      index.toString(),
    );
  }

  getApiKeys(): Promise<ApiKey[]> {
    return this.getApiKeyFromRedis();
  }
}
