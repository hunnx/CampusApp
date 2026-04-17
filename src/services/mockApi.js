/**
 * Mock API responses for frontend-only development
 * Returns mock data without hitting actual backend
 * Replace with real API calls when backend is ready
 */

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
// Load static mock orders JSON
const mockOrders = require('../data/mockOrders.json');

export const mockApiResponses = {
  // Auth endpoints
  'POST:/auth/login': async (data) => {
    await delay();
    if (data?.email === 'student@test.com' && data?.password === 'password') {
      return {
        id: 'student1',
        email: data.email,
        name: 'Test Student',
        role: 'student',
        token: 'mock-student-token-12345',
        createdAt: new Date().toISOString(),
      };
    }
    if (data?.email === 'shopkeeper@test.com' && data?.password === 'password') {
      return {
        id: '1',
        email: data.email,
        name: 'Test Shopkeeper',
        role: 'shopkeeper',
        token: 'mock-shopkeeper-token-12345',
        shopName: 'Campus Shop',
        createdAt: new Date().toISOString(),
      };
    }
    if (data?.email === 'deliverer@test.com' && data?.password === 'password') {
      return {
        id: 'deliverer1',
        email: data.email,
        name: 'Test Deliverer',
        role: 'deliverer',
        token: 'mock-deliverer-token-12345',
        createdAt: new Date().toISOString(),
      };
    }
    // Allow any hardcoded test credentials used in the app
    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: data?.email,
      name: data?.email?.split('@')[0] || 'Test User',
      role: data?.role || 'student',
      token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
  },

  'POST:/auth/register': async (data) => {
    await delay();
    return {
      id: Math.random().toString(36).substr(2, 9),
      email: data?.email,
      name: data?.name,
      role: data?.role || 'student',
      token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
  },

  // Orders endpoints
  'GET:/orders/shopkeeper': async (data) => {
    await delay();
    // Return the static orders array from mockOrders.json
    return mockOrders.orders || [];
  },

  'GET:/orders/student': async (data, endpoint) => {
    await delay();
    // endpoint may be '/orders/student' or '/orders/student/{id}'
    if (endpoint && endpoint.startsWith('/orders/student/')) {
      const parts = endpoint.split('/');
      const studentId = parts[3];
      return (mockOrders.orders || []).filter(o => String(o.studentId) === String(studentId));
    }
    return mockOrders.orders || [];
  },

  'GET:/orders': async (data) => {
    await delay();
    return mockOrders.orders || [];
  },

  'POST:/orders': async (data) => {
    await delay();
    const newOrder = {
      id: 'order_' + Date.now(),
      orderId: 'ORD' + Math.floor(Math.random() * 10000),
      ...(data || {}),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    try {
      if (mockOrders && Array.isArray(mockOrders.orders)) {
        mockOrders.orders.unshift(newOrder);
      }
    } catch (err) {
      // ignore
    }
    return newOrder;
  },

  'PUT:/orders/:id': async (data, endpoint) => {
    await delay();
    const parts = endpoint.split('/');
    const id = parts[2];
    const idx = (mockOrders.orders || []).findIndex(o => String(o.id) === String(id));
    if (idx !== -1) {
      mockOrders.orders[idx] = { ...(mockOrders.orders[idx] || {}), ...(data || {}), updatedAt: new Date().toISOString() };
      return mockOrders.orders[idx];
    }
    return { ...(data || {}), id, updatedAt: new Date().toISOString() };
  },

  // Update status: PUT /orders/:id/status
  'PUT:/orders/:id/status': async (data, endpoint) => {
    await delay();
    const parts = endpoint.split('/');
    const id = parts[2];
    const status = data?.status;
    const idx = (mockOrders.orders || []).findIndex(o => String(o.id) === String(id));
    if (idx !== -1) {
      mockOrders.orders[idx] = { ...(mockOrders.orders[idx] || {}), status, updatedAt: new Date().toISOString() };
      return mockOrders.orders[idx];
    }
    return { id, status, updatedAt: new Date().toISOString() };
  },

  // Accept order: PUT /orders/:id/accept
  'PUT:/orders/:id/accept': async (data, endpoint) => {
    await delay();
    const parts = endpoint.split('/');
    const id = parts[2];
    const delivererId = data?.delivererId;
    const idx = (mockOrders.orders || []).findIndex(o => String(o.id) === String(id));
    if (idx !== -1) {
      mockOrders.orders[idx] = { ...(mockOrders.orders[idx] || {}), delivererId, status: 'picked', updatedAt: new Date().toISOString() };
      return mockOrders.orders[idx];
    }
    return { id, delivererId, status: 'picked', updatedAt: new Date().toISOString() };
  },

  'PATCH:/orders/:id': async (data, endpoint) => {
    await delay();
    const parts = endpoint.split('/');
    const id = parts[2];
    const idx = (mockOrders.orders || []).findIndex(o => String(o.id) === String(id));
    if (idx !== -1) {
      mockOrders.orders[idx] = { ...(mockOrders.orders[idx] || {}), ...(data || {}), updatedAt: new Date().toISOString() };
      return mockOrders.orders[idx];
    }
    return { ...(data || {}), id, updatedAt: new Date().toISOString() };
  },

  // Products endpoints
  'GET:/products': async () => {
    await delay();
    return [
      {
        id: 'prod1',
        name: 'Coffee',
        price: 50,
        category: 'Beverages',
        image: 'https://via.placeholder.com/200',
      },
      {
        id: 'prod2',
        name: 'Tea',
        price: 30,
        category: 'Beverages',
        image: 'https://via.placeholder.com/200',
      },
    ];
  },

  'POST:/products': async (data) => {
    await delay();
    return {
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
    };
  },

  'GET:/products/:id': async (data) => {
    await delay();
    return {
      id: 'prod1',
      name: 'Product Name',
      price: 100,
      description: 'Mock product',
      createdAt: new Date().toISOString(),
    };
  },

  // User endpoints
  'GET:/users/:id': async (data) => {
    await delay();
    return {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
    };
  },

  'PUT:/users/:id': async (data) => {
    await delay();
    return {
      id: 'user1',
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },
};

/**
 * Mock API handler
 * Intercepts requests and returns mock data
 */
export const mockApi = async (method, endpoint, data = null) => {
  // Try exact match first
  let key = `${method}:${endpoint}`;
  let handler = mockApiResponses[key];

  // Try pattern match for endpoints with IDs (e.g., /orders/123 -> /orders/:id)
  if (!handler) {
    // Prefer longer pattern matches first so more specific routes are checked before generic ones
    let patterns = Object.keys(mockApiResponses).filter(k => k.startsWith(`${method}:`));
    patterns = patterns.sort((a, b) => b.length - a.length);
    for (const pattern of patterns) {
      const patternEndpoint = pattern.replace(`${method}:`, '');
      // Exact match
      if (patternEndpoint === endpoint) {
        handler = mockApiResponses[pattern];
        key = pattern;
        console.log(`✅ [MOCK] Exact matched ${method} ${endpoint} -> ${key}`);
        break;
      }
      // Pattern with :id (e.g., /orders/:id/status)
      if (patternEndpoint.includes('/:id')) {
        const regex = new RegExp('^' + patternEndpoint.replace('/:id', '/[^/]+') + '$');
        if (regex.test(endpoint)) {
          handler = mockApiResponses[pattern];
          key = pattern;
          console.log(`✅ [MOCK] Pattern matched ${method} ${endpoint} -> ${key}`);
          break;
        }
      }
      // Prefix match: allow endpoints like '/orders/shopkeeper/1' to match '/orders/shopkeeper'
      if (endpoint.startsWith(patternEndpoint + '/')) {
        handler = mockApiResponses[pattern];
        key = pattern;
        console.log(`✅ [MOCK] Prefix matched ${method} ${endpoint} -> ${key}`);
        break;
      }
    }
  }

  if (handler) {
    try {
      const result = await handler(data, endpoint);
      console.log(`✅ [MOCK] ${method} ${endpoint}`, data ? '✓' : '');
      return result;
    } catch (error) {
      console.log(`❌ [MOCK] ${method} ${endpoint} ERROR:`, error?.message || error);
      throw error;
    }
  }

  // Default: return empty array for unknown endpoints instead of throwing
  console.log(`⚠️ [MOCK] Unknown endpoint: ${key} - returning []`);
  return [];
};

export default mockApi;
