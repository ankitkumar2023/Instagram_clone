import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice.js";
import postSlice from "./slice/PostSlice.js";
import chatSlice from "./slice/chatSlice.js";
import socketSlice from "./slice/socketSlice.js"; // Socket should NOT be persisted
import realTimeNotificationSlice from "./slice/notificationSlice.js";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ✅ Exclude socketio from being persisted
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["socketio"], // ⛔ Prevents Redux Persist from storing WebSocket state
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
  socketio: socketSlice, // This reducer is blacklisted
  realTimeNotification: realTimeNotificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
