export const CacheAPI = {
  addToCache: async (cacheName, url, response) => {
    const cache = await caches.open(cacheName);
    await cache.put(url, response);
  },

  getFromCache: async (cacheName, url) => {
    const cache = await caches.open(cacheName);
    return await cache.match(url);
  },

  deleteCache: async (cacheName) => {
    return await caches.delete(cacheName);
  },
};
