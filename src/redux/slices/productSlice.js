import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { transformProduct } from '../../utils/dataTransformers';

const normalizeProductsPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
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
      const response = await api.get('/products');
      return normalizeProductsPayload(response).map(transformProduct);
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, 'Failed to fetch products'));
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'products/fetchMyProducts',
  async (_, { rejectWithValue, getState }) => {
    try {
      let response;

      try {
        response = await api.get('/products/my');
      } catch {
        response = await api.get('/products');
      }

      let transformedProducts = normalizeProductsPayload(response).map(transformProduct);
      const currentUserId = getState()?.auth?.user?.id;
      const hasOwnershipData = transformedProducts.some(product => product.shopkeeperId);

      if (currentUserId && hasOwnershipData) {
        transformedProducts = transformedProducts.filter(
          product => String(product.shopkeeperId) === String(currentUserId)
        );
      }

      return transformedProducts;
    } catch (error) {
      return rejectWithValue(getProductErrorMessage(error, 'Failed to fetch your products'));
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', {
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
      const response = await api.put(`/products/${id}`, {
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
        const index = state.products.findIndex(product => product.id === action.payload.id);

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
