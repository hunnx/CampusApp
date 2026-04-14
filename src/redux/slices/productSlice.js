import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.get('/products');
      
      // Mock data for demo
      const mockProducts = [
        {
          id: '1',
          name: 'Fresh Juice',
          category: 'Food & Beverages',
          price: 150,
          image: 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=Juice',
          available: true,
          shopkeeperId: '1',
          shopkeeperName: 'Campus Cafe',
        },
        {
          id: '2',
          name: 'Notebook',
          category: 'Stationery',
          price: 80,
          image: 'https://via.placeholder.com/150x150/004E89/FFFFFF?text=Notebook',
          available: true,
          shopkeeperId: '1',
          shopkeeperName: 'Campus Store',
        },
        {
          id: '3',
          name: 'Headphones',
          category: 'Electronics',
          price: 1200,
          image: 'https://via.placeholder.com/150x150/4CAF50/FFFFFF?text=Headphones',
          available: true,
          shopkeeperId: '2',
          shopkeeperName: 'Tech Shop',
        },
        {
          id: '4',
          name: 'T-Shirt',
          category: 'Clothing',
          price: 500,
          image: 'https://via.placeholder.com/150x150/FF9800/FFFFFF?text=T-Shirt',
          available: false,
          shopkeeperId: '3',
          shopkeeperName: 'Fashion Hub',
        },
      ];
      
      return mockProducts;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.post('/products', productData);
      
      // Mock response for demo
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        shopkeeperId: 'current-user-id',
        shopkeeperName: 'Current Shopkeeper',
      };
      
      return newProduct;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.put(`/products/${id}`, productData);
      
      // Mock response for demo
      const updatedProduct = {
        id,
        ...productData,
      };
      
      return updatedProduct;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
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
      // Fetch Products
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
        state.error = action.payload;
      })
      // Add Product
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
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
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
