import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from './slice/authSlice.js'
import postSlice from './slice/PostSlice.js'

import {
   
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'

import reducer from "./slice/authSlice.js";
  
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
  
const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice
})
  
const persistedReducer = persistReducer(persistConfig, rootReducer)
  



const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
})
export default store;