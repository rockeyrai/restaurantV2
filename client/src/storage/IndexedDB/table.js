import { openDB } from "idb";

const TABLE_DB_NAME = "tablesDB";
const TABLE_STORE_NAME = "tables";
const RESERVED_TABLE_STORE_NAME = "reservedTables";

// Open IndexedDB and create stores if they don't exist
const openTableDB = async () => {
  return openDB(TABLE_DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_STORE_NAME)) {
        db.createObjectStore(TABLE_STORE_NAME, {
          keyPath: "id", // Use table ID as the key
        });
      }
      if (!db.objectStoreNames.contains(RESERVED_TABLE_STORE_NAME)) {
        db.createObjectStore(RESERVED_TABLE_STORE_NAME, {
          keyPath: "id", // Use table ID as the key
        });
      }
    },
  });
};

// Store table data in IndexedDB
export const storeTablesInDB = async (tables) => {
  const db = await openTableDB();
  const tx = db.transaction(TABLE_STORE_NAME, "readwrite");
  const store = tx.objectStore(TABLE_STORE_NAME);
  // Clear existing tables and add new ones
  await store.clear();
  await Promise.all(tables.map((table) => store.put(table)));
  await tx.done;
};

// Get table data from IndexedDB
export const getTablesFromDB = async () => {
  const db = await openTableDB();
  const tx = db.transaction(TABLE_STORE_NAME, "readonly");
  const store = tx.objectStore(TABLE_STORE_NAME);
  return await store.getAll();
};

// Save reserved table data in IndexedDB
export const saveReservedTableInDB = async (table) => {
  const db = await openTableDB();
  const tx = db.transaction(RESERVED_TABLE_STORE_NAME, "readwrite");
  const store = tx.objectStore(RESERVED_TABLE_STORE_NAME);
  await store.put(table); // Save the reserved table by its ID
  await tx.done;
};

// Get reserved table data from IndexedDB
export const getReservedTablesFromDB = async () => {
  const db = await openTableDB();
  const tx = db.transaction(RESERVED_TABLE_STORE_NAME, "readonly");
  const store = tx.objectStore(RESERVED_TABLE_STORE_NAME);
  return await store.getAll();
};
