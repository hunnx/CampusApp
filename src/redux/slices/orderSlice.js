import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../constants';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.post('/orders', orderData);
      
      // Create new order
      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        deliveryCharge: 100,
      };
      
      return newOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ userId, userRole }, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.get(`/orders?userId=${userId}&role=${userRole}`);
      
      // For demo, return empty array - orders are managed in Redux state
      return [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.put(`/orders/${orderId}/status`, { status });
      
      // Mock response for demo
      const updatedOrder = {
        id: orderId,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async ({ orderId, delivererId }, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.put(`/orders/${orderId}/accept`, { delivererId });
      
      // Mock response for demo
      const updatedOrder = {
        id: orderId,
        delivererId,
        status: ORDER_STATUS.PICKED,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateOrderRealTime: (state, action) => {
      const { orderId, updates } = action.payload;
      const index = state.orders.findIndex(order => order.id === orderId);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...updates };
      }
    },
    addNewOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // Only replace orders if we have new data, otherwise keep existing (for demo)
        if (action.payload.length > 0) {
          state.orders = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Accept Order
      .addCase(acceptOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        state.error = null;
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateOrderRealTime, addNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
