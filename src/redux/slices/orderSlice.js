import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ORDER_STATUS } from '../../constants';
import api from '../../services/api';
import socketService from '../../services/socket';
import { transformOrder, transformCreateOrderRequest, transformUpdateStatusRequest } from '../../utils/dataTransformers';

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
      // Transform frontend order data to backend format
      const backendRequest = transformCreateOrderRequest(orderData);
      
      const response = await api.post('/orders', backendRequest);
      
      // Transform backend response to frontend format
      const transformedOrder = transformOrder(response);
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('newOrder', transformedOrder);
      }
      
      // Persist the order in mock storage for offline/demo review
      saveOrderToMockStorage(transformedOrder);
      
      return transformedOrder;
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
        endpoint = `/orders/user`;
      } else if (userRole === 'shopkeeper') {
        endpoint = `/orders/shopkeeper`;
      } else if (userRole === 'deliverer') {
        endpoint = `/orders/deliverer`;
      }
      
      const response = await api.get(endpoint);
      
      // Transform backend orders to frontend format
      const transformedOrders = Array.isArray(response) 
        ? response.map(transformOrder)
        : [];
      
      return transformedOrders;
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
      // Transform status to backend format (capitalize first letter)
      const backendRequest = transformUpdateStatusRequest(status);
      
      const response = await api.put(`/orders/${orderId}/status`, backendRequest);
      
      // Transform backend response to frontend format
      const transformedOrder = transformOrder(response);
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderStatusUpdate', { orderId, status });
      }
      
      return transformedOrder;
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
      const response = await api.get(`/orders/shopkeeper`);
      
      // Transform backend orders to frontend format
      const transformedOrders = Array.isArray(response) 
        ? response.map(transformOrder)
        : [];
      
      return transformedOrders;
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
      const response = await api.post(`/orders/${orderId}/accept`);
      
      // Transform backend response to frontend format
      const transformedOrder = transformOrder(response);
      
      // Emit socket event for real-time updates
      const socket = socketService.socket;
      if (socket && socketService.isConnected()) {
        socket.emit('orderAccepted', { orderId, delivererId });
      }
      
      return transformedOrder;
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
        // Merge/upsert fetched orders into existing state to avoid overwriting
        // local/mock updates (keep existing orders and apply incoming updates)
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          const incoming = action.payload;
          incoming.forEach(item => {
            const idx = state.orders.findIndex(o => String(o.id) === String(item.id));
            if (idx !== -1) {
              state.orders[idx] = { ...state.orders[idx], ...item };
            } else {
              state.orders.unshift(item);
            }
          });
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
        const index = state.orders.findIndex(order => String(order.id) === String(action.payload.id));
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        } else {
          // upsert if not found
          state.orders.unshift(action.payload);
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
        const index = state.orders.findIndex(order => String(order.id) === String(action.payload.id));
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        } else {
          // upsert: add accepted order if it wasn't present
          state.orders.unshift(action.payload);
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
