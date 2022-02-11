import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search_location/searchSlice';
export const store = configureStore({
  reducer: {
    search: searchReducer
  },
});
