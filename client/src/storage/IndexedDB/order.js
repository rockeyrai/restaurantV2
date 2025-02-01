import { openDB } from "idb";

const ORDER_DB_NAME = "OrderDB";
const ORDER_STORE_NAME = "orders";

// Initialize the IndexedDB
export const initOrderDB = async () => {
  return await openDB(ORDER_DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ORDER_STORE_NAME)) {
        db.createObjectStore(ORDER_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Add an order to IndexedDB
export const addOrderToIndexedDB = async (order) => {
  const db = await initOrderDB();
  await db.put(ORDER_STORE_NAME, order);
};

// Get all orders from IndexedDB
export const getAllOrdersFromIndexedDB = async () => {
  const db = await initOrderDB();
  return await db.getAll(ORDER_STORE_NAME);
};

// Delete an order from IndexedDB
export const deleteOrderFromIndexedDB = async (id) => {
  const db = await initOrderDB();
  await db.delete(ORDER_STORE_NAME, id);
};
