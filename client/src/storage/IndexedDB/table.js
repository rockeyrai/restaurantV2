// TableDB.js
import { openDB } from "idb";

const TABLE_DB_NAME = "TableDB";
const TABLE_STORE_NAME = "tables";

// Initialize IndexedDB for table data
const initTableDB = async () => {
  return await openDB(TABLE_DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_STORE_NAME)) {
        db.createObjectStore(TABLE_STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Save table data to IndexedDB
export const saveTableData = async (tableData) => {
  const db = await initTableDB();
  await db.put(TABLE_STORE_NAME, tableData);
};

// Retrieve all table data from IndexedDB
export const getAllTables = async () => {
  const db = await initTableDB();
  return await db.getAll(TABLE_STORE_NAME);
};

// Clear all table data from IndexedDB
export const clearTableData = async () => {
  const db = await initTableDB();
  await db.clear(TABLE_STORE_NAME);
};
