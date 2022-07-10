import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './slice';
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
});
