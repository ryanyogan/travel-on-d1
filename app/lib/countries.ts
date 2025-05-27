import {
  type Cache,
  type CacheEntry,
  cachified,
  totalTtl,
} from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 });

const lru: Cache = {
  set(key, value) {
    const ttl = totalTtl(value?.metadata);
    return lruInstance.set(key, value, {
      ttl: ttl === Infinity ? undefined : ttl,
      start: value?.metadata?.createdTime,
    });
  },
  get(key) {
    return lruInstance.get(key);
  },
  delete(key) {
    return lruInstance.delete(key);
  },
};

export async function getCountries() {
  return cachified({
    key: `global:countries`,
    cache: lru,
    async getFreshValue() {
      console.log("Fetching countries from API...");
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = (await response.json()) as any;
      return data;
    },
    ttl: 1000 * 60 * 60 * 24, // 24 hours
  });
}
