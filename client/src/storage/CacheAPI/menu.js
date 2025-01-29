const CACHE_NAME = "menu-cache";

// Save menu data to the Cache API
export const saveMenuToCache = async (menuData) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(menuData), {
      headers: { "Content-Type": "application/json" },
    });
    // Use the full URL to store the cache
    await cache.put(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`, response);
  } catch (error) {
    console.error("Error saving menu to cache:", error);
  }
};

// Retrieve menu data from the Cache API
export const getMenuFromCache = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`);
    if (!cachedResponse) return null;
    return await cachedResponse.json();
  } catch (error) {
    console.error("Error retrieving menu from cache:", error);
    return null;
  }
};

// Clear the menu data from the cache
export const clearMenuCache = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`);
  } catch (error) {
    console.error("Error clearing menu cache:", error);
  }
};
