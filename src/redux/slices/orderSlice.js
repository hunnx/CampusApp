import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../constants';

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.post('/orders', orderData);
      
      // Mock response for demo
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
      
      // Mock data for demo
      const mockOrders = [
        {
          id: '1',
          studentId: 'student1',
          studentName: 'John Doe',
          shopkeeperId: 'shopkeeper1',
          shopkeeperName: 'Campus Cafe',
          delivererId: null,
          delivererName: null,
          items: [
            { productId: '1', name: 'Fresh Juice', price: 150, quantity: 2 },
            { productId: '2', name: 'Sandwich', price: 200, quantity: 1 },
          ],
          totalAmount: 500,
          deliveryCharge: 100,
          status: ORDER_STATUS.PENDING,
          createdAt: new Date().toISOString(),
          pickupLocation: 'Campus Cafe',
          dropLocation: 'Hostel A',
        },
        {
          id: '2',
          studentId: 'student2',
          studentName: 'Jane Smith',
          shopkeeperId: 'shopkeeper1',
          shopkeeperName: 'Campus Cafe',
          delivererId: 'deliverer1',
          delivererName: 'Mike Johnson',
          items: [
            { productId: '3', name: 'Coffee', price: 120, quantity: 1 },
          ],
          totalAmount: 220,
          deliveryCharge: 100,
          status: ORDER_STATUS.READY,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          pickupLocation: 'Campus Cafe',
          dropLocation: 'Library',
        },
      ];
      
      return mockOrders;
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
        state.orders = action.payload;
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
