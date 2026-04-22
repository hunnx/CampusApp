import io from 'socket.io-client';
import { SOCKET_BASE_URL } from '../constants';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_BASE_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Order events
  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('newOrder', callback);
    }
  }

  onOrderStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on('orderStatusUpdate', callback);
    }
  }

  onDeliveryUpdate(callback) {
    if (this.socket) {
      this.socket.on('deliveryUpdate', callback);
    }
  }

  // Emit events
  emitOrderStatus(orderId, status) {
    if (this.socket) {
      this.socket.emit('updateOrderStatus', { orderId, status });
    }
  }

  emitDeliveryUpdate(orderId, location) {
    if (this.socket) {
      this.socket.emit('deliveryUpdate', { orderId, location });
    }
  }

  // Join rooms based on user role
  joinShopkeeperRoom(shopkeeperId) {
    if (this.socket) {
      this.socket.emit('joinShopkeeperRoom', shopkeeperId);
    }
  }

  joinDelivererRoom(delivererId) {
    if (this.socket) {
      this.socket.emit('joinDelivererRoom', delivererId);
    }
  }

  joinStudentRoom(studentId) {
    if (this.socket) {
      this.socket.emit('joinStudentRoom', studentId);
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new SocketService();
