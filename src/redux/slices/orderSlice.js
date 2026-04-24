import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import socketService from '../../services/socket';
import {
  transformOrder,
  transformCreateOrderRequest,
  transformUpdateStatusRequest,
} from '../../utils/dataTransformers';

const normalizeOrdersPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (payload) {
    return [payload];
  }

  return [];
};

const getOrderErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  fallbackMessage
);

const emitIfConnected = (eventName, payload) => {
  const socket = socketService.socket;
  if (socket && socketService.isConnected()) {
    socket.emit(eventName, payload);
  }
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Get user ID from auth state and attach to order data
      const state = getState();
      const userId = state.auth.user?.id;

      // Attach customer ID to order data
      const orderDataWithCustomerId = {
        ...orderData,
        customerId: userId || orderData.customerId || orderData.studentId
      };

      console.log('orderSlice - createOrder - orderDataWithCustomerId:', JSON.stringify(orderDataWithCustomerId, null, 2));

      const backendRequest = transformCreateOrderRequest(orderDataWithCustomerId);
      console.log('orderSlice - createOrder - backendRequest:', JSON.stringify(backendRequest, null, 2));

      const response = await api.post('/Orders', backendRequest);
      console.log('orderSlice - createOrder - backend response:', JSON.stringify(response, null, 2));

      const transformedOrder = transformOrder(response);
      console.log('orderSlice - createOrder - transformedOrder:', JSON.stringify(transformedOrder, null, 2));

      emitIfConnected('newOrder', transformedOrder);

      return transformedOrder;
    } catch (error) {
      console.error('orderSlice - createOrder - error:', error);
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to create order'));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ userRole }, { rejectWithValue }) => {
    try {
      let endpoint = '';

      if (userRole === 'student') {
        endpoint = '/Orders/user';
      } else if (userRole === 'shopkeeper') {
        endpoint = '/Orders/shopkeeper';
      } else if (userRole === 'deliverer') {
        endpoint = '/Orders/available';
      }

      if (!endpoint) {
        return rejectWithValue('Unsupported user role for orders');
      }

      const response = await api.get(endpoint);
      return normalizeOrdersPayload(response).map(transformOrder);
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to fetch orders'));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const backendRequest = transformUpdateStatusRequest(status);
      const response = await api.put(`/Orders/${orderId}/status`, backendRequest);
      const transformedOrder = transformOrder(response);

      emitIfConnected('orderStatusUpdate', { orderId, status });

      return transformedOrder;
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to update order status'));
    }
  }
);

export const fetchShopkeeperOrders = createAsyncThunk(
  'orders/fetchShopkeeperOrders',
  async (_, { rejectWithValue }) => {
    try {
      console.log('orderSlice - fetchShopkeeperOrders - fetching orders from /Orders/shopkeeper');
      const response = await api.get('/Orders/shopkeeper');
      console.log('orderSlice - fetchShopkeeperOrders - raw response:', JSON.stringify(response, null, 2));
      const normalized = normalizeOrdersPayload(response);
      console.log('orderSlice - fetchShopkeeperOrders - normalized:', JSON.stringify(normalized, null, 2));
      const transformed = normalized.map(transformOrder);
      console.log('orderSlice - fetchShopkeeperOrders - transformed orders:', JSON.stringify(transformed, null, 2));
      return transformed;
    } catch (error) {
      console.error('orderSlice - fetchShopkeeperOrders - error:', error);
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to fetch shopkeeper orders'));
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async ({ orderId, delivererId }, { rejectWithValue }) => {
    try {
      const requestData = delivererId ? { delivererId } : undefined;
      const response = await api.post(`/Orders/${orderId}/accept`, requestData);
      const transformedOrder = transformOrder(response);

      emitIfConnected('orderAccepted', { orderId, delivererId });

      return transformedOrder;
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to accept order'));
    }
  }
);

export const fetchDelivererAssignedOrders = createAsyncThunk(
  'orders/fetchDelivererAssignedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Orders/deliverer');
      return normalizeOrdersPayload(response).map(transformOrder);
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to fetch deliverer orders'));
    }
  }
);

const upsertOrder = (orders, incomingOrder) => {
  const index = orders.findIndex(order => String(order.id) === String(incomingOrder.id));

  if (index !== -1) {
    orders[index] = { ...orders[index], ...incomingOrder };
    return;
  }

  orders.unshift(incomingOrder);
};

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
      const index = state.orders.findIndex(order => String(order.id) === String(orderId));

      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...updates };
      }
    },
    addNewOrder: (state, action) => {
      upsertOrder(state.orders, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        upsertOrder(state.orders, action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
        state.orders = [];
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        upsertOrder(state.orders, action.payload);
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(acceptOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        upsertOrder(state.orders, action.payload);
        state.error = null;
      })
      .addCase(acceptOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchShopkeeperOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchShopkeeperOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = [];
        state.error = action.payload;
      })
      .addCase(fetchDelivererAssignedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDelivererAssignedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchDelivererAssignedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.orders = [];
        state.error = action.payload;
      });
  },
});

export const { clearError, updateOrderRealTime, addNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
