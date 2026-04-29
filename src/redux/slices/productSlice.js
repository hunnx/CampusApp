import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { transformProduct } from '../../utils/dataTransformers';

const normalizeProductsPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.products)) {
    return payload.products;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
};

const getProductErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallbackMessage
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[productSlice] Fetching products from API...');
      console.log('[productSlice] API instance:', api);
      console.log('[productSlice] API baseURL:', api.defaults.baseURL);
      console.log('[productSlice] api.get function:', typeof api.get);
      console.log('[productSlice] About to call api.get(/Products)');

      const startTime = Date.now();
      console.log('[productSlice] Calling api.get now...');
      console.log('[productSlice] Calling api.get now2222');

      const response = await api.get('/Products');
      const endTime = Date.now();

      console.log('[productSlice] API response received after', endTime - startTime, 'ms');
      console.log('[productSlice] API response:', response);
      console.log('[productSlice] Response type:', typeof response);
      console.log('[productSlice] Response is array:', Array.isArray(response));
      const normalized = normalizeProductsPayload(response);
      console.log('[productSlice] Normalized products:', normalized);
      console.log('[productSlice] Normalized is array:', Array.isArray(normalized));
      const transformed = normalized.map(transformProduct);
      console.log('[productSlice] Transformed products:', transformed);
      return transformed;
    } catch (error) {
      console.error('[productSlice] Fetch error:', error);
      console.error('[productSlice] Error message:', error.message);
      console.error('[productSlice] Error response:', error.response);
      console.error('[productSlice] Error code:', error.code);
      return rejectWithValue(getProductErrorMessage(error, 'Failed to fetch products'));
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'products/fetchMyProducts',
  async (_, { rejectWithValue }) => {
    try {
      let response;

      try {
        response = await api.get('/Products/my');
      } catch {
        response = await api.get('/Products');
      }

      return normalizeProductsPayload(response).map(transformProduct);
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, 'Failed to fetch your products'));
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/Products', {
        productCategoryId: productData.categoryId || 1,
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        imageUrl: productData.image,
        preperationTimeMinutes: productData.preparationTime || 15,
        isAvailable: productData.available !== undefined ? productData.available : true,
      });

      return transformProduct(response);
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, 'Failed to add product'));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/Products/${id}`, {
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        imageUrl: productData.image,
        preperationTimeMinutes: productData.preparationTime || 15,
        isAvailable: productData.available !== undefined ? productData.available : true,
      });

      return transformProduct(response);
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, 'Failed to update product'));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.error = action.payload;
      })
      .addCase(fetchMyProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProductId = action.payload.productCategoryItemId || action.payload.id;
        const index = state.products.findIndex(
          product => String(product.productCategoryItemId || product.id) === String(updatedProductId)
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setProducts } = productSlice.actions;
export default productSlice.reducer;
