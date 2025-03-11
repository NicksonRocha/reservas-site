import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import businessReducer from './slices/businessSlice'; 
import productReducer from './slices/productSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,     
        business: businessReducer, 
        products: productReducer,
    },
});
