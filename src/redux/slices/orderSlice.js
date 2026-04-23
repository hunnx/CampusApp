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
  async (orderData, { rejectWithValue }) => {
    try {
      const backendRequest = transformCreateOrderRequest(orderData);
      const response = await api.post('/orders', backendRequest);
      const transformedOrder = transformOrder(response);

      emitIfConnected('newOrder', transformedOrder);

      return transformedOrder;
    } catch (error) {
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
        endpoint = '/orders/user';
      } else if (userRole === 'shopkeeper') {
        endpoint = '/orders/shopkeeper';
      } else if (userRole === 'deliverer') {
        endpoint = '/orders/deliverer';
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
      const response = await api.put(`/orders/${orderId}/status`, backendRequest);
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
      const response = await api.get('/orders/shopkeeper');
      return normalizeOrdersPayload(response).map(transformOrder);
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to fetch shopkeeper orders'));
    }
  }
);

export const acceptOrder = createAsyncThunk(
  'orders/acceptOrder',
  async ({ orderId, delivererId }, { rejectWithValue }) => {
    try {
      const requestData = delivererId ? { delivererId } : undefined;
      const response = await api.post(`/orders/${orderId}/accept`, requestData);
      const transformedOrder = transformOrder(response);

      emitIfConnected('orderAccepted', { orderId, delivererId });

      return transformedOrder;
    } catch (error) {
      return rejectWithValue(getOrderErrorMessage(error, 'Failed to accept order'));
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
      });
  },
});

export const { clearError, updateOrderRealTime, addNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
