import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => String(item.productCategoryItemId) === String(product.productCategoryItemId)
      );

      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        state.items[existingItemIndex].quantity += quantity;
        state.items[existingItemIndex].totalPrice = state.items[existingItemIndex].price * state.items[existingItemIndex].quantity;
      } else {
        // Add new item
        const newItem = {
          ...product,
          productCategoryItemId: product.productCategoryItemId?.toString(),
          quantity,
          totalPrice: product.price * quantity,
        };
        state.items.push(newItem);
      }

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },
    removeFromCart: (state, action) => {
      const productCategoryItemId = action.payload;
      state.items = state.items.filter(
        item => String(item.productCategoryItemId) !== String(productCategoryItemId)
      );

      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },
    updateQuantity: (state, action) => {
      const { productCategoryItemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        item => String(item.productCategoryItemId) === String(productCategoryItemId)
      );

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          state.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          state.items[itemIndex].quantity = quantity;
          state.items[itemIndex].totalPrice = state.items[itemIndex].price * quantity;
        }

        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
