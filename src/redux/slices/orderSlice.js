import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../constants';
import api from '../../services/api';
import socketService from '../../services/socket';

// Mock storage for orders (in a real app, this would be a database)
let mockOrdersStorage = [];
// Initialize mock storage from static JSON so orders persist across screens during development
try {
  // require here so bundler includes the JSON file
  const mockOrdersJson = require('../../data/mockOrders.json');
  if (mockOrdersJson && Array.isArray(mockOrdersJson.orders)) {
    mockOrdersStorage = mockOrdersJson.orders;
  }
} catch (err) {
  console.log('No mockOrders.json found or failed to load:', err.message);
}
console.log(`✅ mockOrdersStorage initialized with ${mockOrdersStorage.length} orders`);

const getMockOrdersByShopkeeper = (shopkeeperId) => {
  return mockOrdersStorage.filter(order => order.shopkeeperId === shopkeeperId);
};

const getMockOrdersByStudent = (studentId) => {
  return mockOrdersStorage.filter(order => order.studentId === studentId);
};

const getMockOrdersByDeliverer = (delivererId) => {
  return mockOrdersStorage.filter(order => order.delivererId === delivererId);
};

const normalizeOrdersPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (!payload) {
    return [];
  }
  if (payload.orders && Array.isArray(payload.orders)) {
    return payload.orders;
  }
  if (payload.data && Array.isArray(payload.data)) {
    return payload.data;
  }
  return [payload];
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Try to make API call
      const response = await api.post('/orders', orderData);
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('newOrder', response);
      }
      
      // Persist the order in mock storage for offline/demo review
      saveOrderToMockStorage(response);
      
      return response;
    } catch (error) {
      // API call failed, create mock order for demo purposes
      console.log('API call failed, creating mock order for demo');
      
      const mockOrder = {
        id: Date.now().toString(),
        ...orderData,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      };
      
      // Store in mock storage
      saveOrderToMockStorage(mockOrder);
      console.log('Order stored in mock storage:', mockOrder);
      console.log('Total orders in storage:', mockOrdersStorage.length);
      
      // Still emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('newOrder', mockOrder);
      }
      
      return mockOrder;
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ userId, userRole }, { rejectWithValue }) => {
    try {
      let endpoint = '';
      
      if (userRole === 'student') {
        endpoint = `/orders/student/${userId}`;
      } else if (userRole === 'shopkeeper') {
        endpoint = `/orders/shopkeeper/${userId}`;
      } else if (userRole === 'deliverer') {
        endpoint = `/orders/deliverer/${userId}`;
      }
      
      const response = await api.get(endpoint);
      return normalizeOrdersPayload(response);
    } catch (error) {
      // API call failed, return orders from mock storage for demo
      console.log('API call failed, returning mock orders for demo');
      
      if (userRole === 'student') {
        return getMockOrdersByStudent(userId);
      } else if (userRole === 'shopkeeper') {
        return getMockOrdersByShopkeeper(userId);
      } else if (userRole === 'deliverer') {
        return getMockOrdersByDeliverer(userId);
      }
      
      return [];
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderStatusUpdate', { orderId, status });
      }
      
      return response;
    } catch (error) {
      // API call failed, create mock response for demo
      console.log('API call failed, creating mock order status update for demo');
      
      const mockResponse = {
        id: orderId,
        status,
        updatedAt: new Date().toISOString(),
      };
      
      // Update in mock storage
      const orderIndex = mockOrdersStorage.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockOrdersStorage[orderIndex] = {
          ...mockOrdersStorage[orderIndex],
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Still emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderStatusUpdate', { orderId, status });
      }
      
      return mockResponse;
    }
  }
);

export const fetchShopkeeperOrders = createAsyncThunk(
  'orders/fetchShopkeeperOrders',
  async (shopkeeperId, { rejectWithValue }) => {
    try {
      // Request mock/shopkeeper orders endpoint (mockApi provides static data)
      const response = await api.get(`/orders/shopkeeper`);
      const payload = normalizeOrdersPayload(response);
      // If the mock returns a wrapped object (e.g., { success: true, data: [...] }), normalize will handle it.
      // Filter by shopkeeperId so this endpoint remains compatible with a future backend.
      let filtered = Array.isArray(payload)
        ? payload.filter(order => String(order.shopkeeperId) === String(shopkeeperId))
        : [];

      // If nothing matched (e.g., user logged in with different id), fall back to mock storage
      if ((!filtered || filtered.length === 0) && mockOrdersStorage.length > 0) {
        filtered = mockOrdersStorage.filter(o => String(o.shopkeeperId) === String(shopkeeperId) || String(o.shopkeeperId) === '1');
      }

      return filtered;
    } catch (error) {
      // API call failed, return orders from mock storage for demo
      console.log('API call failed, returning mock shopkeeper orders for demo');
      const orders = getMockOrdersByShopkeeper(shopkeeperId);
      console.log('Found orders for shopkeeper', shopkeeperId, ':', orders);
      return orders;
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async ({ orderId, delivererId }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/accept`, { delivererId });
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderAccepted', { orderId, delivererId });
      }
      
      return response;
    } catch (error) {
      // API call failed, create mock response for demo
      console.log('API call failed, creating mock order acceptance for demo');
      
      const mockResponse = {
        id: orderId,
        delivererId,
        status: ORDER_STATUS.PICKED,
        updatedAt: new Date().toISOString(),
      };
      
      // Update in mock storage
      const orderIndex = mockOrdersStorage.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockOrdersStorage[orderIndex] = {
          ...mockOrdersStorage[orderIndex],
          delivererId,
          status: ORDER_STATUS.PICKED,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Still emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderAccepted', { orderId, delivererId });
      }
      
      return mockResponse;
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: mockOrdersStorage.slice(),
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
      })
      // Fetch Shopkeeper Orders
      .addCase(fetchShopkeeperOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        // Only replace orders if API returned data; keep existing static mocks otherwise
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.orders = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateOrderRealTime, addNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
