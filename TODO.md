# TODO - Bottom Navigation Fix

## Task: Fix Bottom Navigation Bar Overlap Issue

### Steps Completed:
- [x] 1. Update BottomSpacerView to use dynamic safe area insets
- [x] 2. Fix CartScreen.js - add proper bottom padding for summary card
- [x] 3. Update ProductDetailScreen.js - add SafeAreaView and bottom padding
- [x] 4. Update CheckoutScreen.js - add SafeAreaView and bottom padding
- [x] 5. Update OrderTrackingScreen.js - add SafeAreaView and bottom padding
- [x] 6. Fix StudentNavigator.js - use consistent CONTENT_BOTTOM_PADDING
- [x] 7. Fix ShopkeeperNavigator.js - use consistent CONTENT_BOTTOM_PADDING
- [x] 8. Fix DelivererNavigator.js - use consistent CONTENT_BOTTOM_PADDING

### Implementation Notes:
- Use react-native-safe-area-context for dynamic insets
- Ensure bottom padding accounts for tab bar height (88px) + safe area
- Support both Android and iOS safe areas
