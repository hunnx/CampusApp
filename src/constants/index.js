// App Constants
// export const API_ORIGIN = 'https://localhost:7200';
export const API_ORIGIN = 'https://handiness-sprang-elude.ngrok-free.dev';
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const SOCKET_BASE_URL = API_ORIGIN;

export const USER_ROLES = {
  STUDENT: 'student',
  SHOPKEEPER: 'shopkeeper',
  DELIVERER: 'deliverer',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED: 'picked',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
};

export const DELIVERY_CHARGE = 100; // PKR

export const COLORS = {
  primary: '#6B8E23',   // olive green
  secondary: '#2D2A26', // dark brown-black
  success: '#7BAE7F',
  warning: '#D4A373',
  danger: '#E76F51',
  dark: '#1C1917',
  light: '#FAF7F2',
  white: '#FFFFFF',
  gray: '#A8A29E',
  border: '#E7E5E4',
  card: '#FFFCF8',
};

export const SIZES = {
  base: 8,
  font: 14,
  padding: 12,
  radius: 12,
  h1: 30,
  h2: 22,
  h3: 16,
};

export const PRODUCT_CATEGORIES = [
  'Food & Beverages',
  'Stationery',
  'Electronics',
  'Clothing',
  'Books',
  'Sports',
  'Others',
];
