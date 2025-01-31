const CACHE_NAME = "menu-cache";

// Save menu data to the Cache API
export const saveMenuToCache = async (menu) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(menu), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`, response);
  } catch (error) {
    console.error("Error saving menu to cache:", error);
  }
};


// Retrieve menu data from the Cache API
export const getMenuFromCache = async () => {
  try {
    const cache = await caches.open("menu-cache");
    const cachedResponse = await cache.match(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`);
    if (!cachedResponse) {
      console.log("No cached menu found.");
      return null;
    }
    const data = await cachedResponse.json(); // Parse JSON response
    console.log("Menu retrieved from cache:", data);
    return data;
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
