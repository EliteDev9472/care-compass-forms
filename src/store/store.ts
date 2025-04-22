
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './authSlice';
import patientReducer from './patientSlice';
import timerReducer from './timerSlice';
import icdCodesReducer from './icdCodesSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Only persist auth state across sessions
};

const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientReducer,
  timer: timerReducer,
  icdCodes: icdCodesReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these paths in the Redux state (for non-serializable data)
        ignoredPaths: ['icdCodes.codes'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
