// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // Uses localStorage for web
// import userReducer from "../redux/slice/userSlice";

// // Redux Persist configuration
// const persistConfig = {
//   key: "root", // Key to save the persisted state
//   storage, // Storage to use (localStorage in this case)
//   whitelist: ["user"], // Reducers to persist (e.g., user slice)
// };

// const persistedReducer = persistReducer(persistConfig, userReducer);
// const store = configureStore({
//   reducer: {
//     user: persistedReducer, // Use persisted reducer
//     // Add other reducers here if needed (non-persistent ones go directly)
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // Required for Redux Persist
//     }),
//   devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
// });

// const persistor = persistStore(store);

// export { store, persistor };

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as storage
import { combineReducers } from "redux";
import userReducer from "../redux/slice/userSlice";
import { thunk } from "redux-thunk";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist only the 'user' slice
};

// Apply persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
        ],
      },
    }).concat(thunk),
});

// Create persistor
export const persistor = persistStore(store);

