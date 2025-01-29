// OrderDB.js
import { openDB } from "idb";

const ORDER_DB_NAME = "OrderDB";
const ORDER_STORE_NAME = "orders";

// Initialize IndexedDB for order data
const initOrderDB = async () => {
  return await openDB(ORDER_DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(ORDER_STORE_NAME)) {
        db.createObjectStore(ORDER_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Save order data to IndexedDB
export const saveOrderData = async (orderData) => {
  const db = await initOrderDB();
  await db.put(ORDER_STORE_NAME, orderData);
};

// Retrieve all orders from IndexedDB
export const getAllOrders = async () => {
  const db = await initOrderDB();
  return await db.getAll(ORDER_STORE_NAME);
};

// Clear all order data from IndexedDB
export const clearOrderData = async () => {
  const db = await initOrderDB();
  await db.clear(ORDER_STORE_NAME);
};
