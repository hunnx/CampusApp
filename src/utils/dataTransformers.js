/**
 * Data transformation utilities to convert backend API responses
 * to frontend-expected format (PascalCase to camelCase, field name mapping)
 */

const toCamelCase = (str) => {
  if (!str) {
    return str;
  }

  return str
    .replace(/^[A-Z]/, letter => letter.toLowerCase())
    .replace(/[_-](\w)/g, (_, letter) => letter.toUpperCase());
};

const pickFirstDefined = (...values) => values.find(
  value => value !== undefined && value !== null && value !== ''
);

const toInteger = (value) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

// Safe numeric parser - converts any value to a valid number with fallback
const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

// Safe string converter - ensures value is a string with fallback
const toString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

// Safe array parser - ensures value is an array with fallback
const toArray = (value, fallback = []) => {
  if (!value) return fallback;
  return Array.isArray(value) ? value : fallback;
};

const transformKeysToCamelCase = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => transformKeysToCamelCase(item));
  }

  if (typeof obj === 'object') {
    const transformed = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = toCamelCase(key);
        transformed[camelKey] = transformKeysToCamelCase(obj[key]);
      }
    }
    return transformed;
  }

  return obj;
};

export const transformAuthResponse = (backendResponse) => {
  const transformed = transformKeysToCamelCase(backendResponse);
  return {
    id: transformed.userId?.toString() || transformed.id,
    name: `${transformed.firstName || ''} ${transformed.lastName || ''}`.trim(),
    email: transformed.emailAddress || transformed.email,
    role: transformed.roleName?.toLowerCase() || transformed.role,
    token: transformed.token,
    createdAt: transformed.expiresAt || new Date().toISOString(),
  };
};

export const transformOrder = (backendOrder) => {
  const transformed = transformKeysToCamelCase(backendOrder);
  
  // Log raw response for debugging API data issues
  console.log('[transformOrder] Raw backend order:', JSON.stringify(backendOrder, null, 2));
  console.log('[transformOrder] Transformed keys:', JSON.stringify(transformed, null, 2));
  
  // Safely parse items array
  const itemsArray = toArray(transformed.orderItems || transformed.items);
  console.log('[transformOrder] Items array:', JSON.stringify(itemsArray, null, 2));
  
  // Transform each item with safe numeric conversion
  const transformedItems = itemsArray.map((item, index) => {
    const itemPrice = toNumber(item.unitPrice || item.price, 0);
    const itemQuantity = toNumber(item.quantity, 0);
    const itemSubtotal = toNumber(item.subtotal, itemPrice * itemQuantity);
    
    console.log(`[transformOrder] Item ${index}: price=${itemPrice}, quantity=${itemQuantity}, subtotal=${itemSubtotal}`);
    
    return {
      id: toString(item.orderItemId || item.id, ''),
      productCategoryItemId: toString(item.productCategoryItemId || item.productId, ''),
      name: toString(item.productName || item.name, 'Unknown Item'),
      price: itemPrice,
      quantity: itemQuantity,
      subtotal: itemSubtotal,
    };
  });
  
  // Safe numeric conversions
  const orderTotalAmount = toNumber(transformed.totalAmount, 0);
  const orderDeliveryCharge = toNumber(transformed.deliveryFee, 0);
  
  console.log('[transformOrder] Numeric values - totalAmount:', orderTotalAmount, 'deliveryCharge:', orderDeliveryCharge);
  
  return {
    id: toString(transformed.orderId || transformed.id, ''),
    orderId: toString(transformed.orderId || transformed.orderId, ''),
    studentId: toString(transformed.customerId || transformed.customerId, ''),
    studentName: toString(transformed.customerName || transformed.studentName, 'Unknown'),
    shopkeeperId: toString(transformed.shopkeeperId, ''),
    shopkeeperName: toString(transformed.shopkeeperName, 'Unknown Shop'),
    delivererId: toString(transformed.delivererId, ''),
    status: toString(transformed.orderStatus || transformed.status, 'pending').toLowerCase(),
    items: transformedItems,
    totalAmount: orderTotalAmount,
    deliveryCharge: orderDeliveryCharge,
    pickupLocation: toString(transformed.pickupPoint || transformed.pickupLocation, 'Shop'),
    dropLocation: toString(transformed.destination || transformed.dropLocation, 'N/A'),
    contactNumber: toString(transformed.contactNumber, ''),
    orderNotes: toString(transformed.specialNotes || transformed.orderNotes, ''),
    paymentMethod: toString(transformed.paymentMethod, 'Cash'),
    paymentStatus: toString(transformed.paymentStatus, 'Pending'),
    createdAt: toString(transformed.dateAdded || transformed.createdAt, new Date().toISOString()),
    updatedAt: toString(transformed.dateUpdated || transformed.updatedAt, new Date().toISOString()),
  };
};

export const transformProduct = (backendProduct) => {
  const transformed = transformKeysToCamelCase(backendProduct);
  const productCategoryItemId = pickFirstDefined(
    transformed.productCategoryItemId,
    transformed.productId,
    transformed.id
  );
  const productCategoryId = pickFirstDefined(
    transformed.productCategoryId,
    transformed.categoryId,
    null
  );
  const numericPrice = Number(
    pickFirstDefined(
      transformed.productPrice,
      transformed.price,
      0
    )
  );
  const numericQuantity = Number(
    pickFirstDefined(
      transformed.quantity,
      transformed.stockQuantity,
      0
    )
  );
  const numericPreparationTime = Number(
    pickFirstDefined(
      transformed.preperationTimeMinutes,
      transformed.preparationTimeMinutes,
      transformed.preparationTime,
      0
    )
  );
  const available = pickFirstDefined(
    transformed.isAvailable,
    transformed.available,
    transformed.inStock,
    false
  );
  const imageUrl = pickFirstDefined(
    transformed.imageUrl,
    transformed.productImageUrl,
    transformed.image,
    transformed.productImage,
    null
  );
  const categoryName = pickFirstDefined(
    transformed.categoryName,
    transformed.productCategoryName,
    transformed.category,
    transformed.productCategory,
    ''
  );
  const isAvailable = Boolean(available);

  return {
    productCategoryItemId: productCategoryItemId !== undefined && productCategoryItemId !== null
      ? productCategoryItemId.toString()
      : '',
    productCategoryId: productCategoryId !== undefined && productCategoryId !== null
      ? productCategoryId.toString()
      : null,
    shopkeeperId: transformed.shopkeeperId?.toString() || transformed.shopkeeperId,
    name: pickFirstDefined(transformed.productName, transformed.name, ''),
    price: Number.isFinite(numericPrice) ? numericPrice : 0,
    quantity: Number.isFinite(numericQuantity) ? numericQuantity : 0,
    imageUrl,
    preperationTimeMinutes: Number.isFinite(numericPreparationTime) ? numericPreparationTime : 0,
    isAvailable,
    dateAdded: pickFirstDefined(transformed.dateAdded, transformed.createdAt, null),
    dateUpdated: pickFirstDefined(transformed.dateUpdated, transformed.updatedAt, null),
    categoryName,
    description: pickFirstDefined(
      transformed.description,
      transformed.productDescription,
      transformed.details,
      ''
    ),
    // Compatibility aliases for existing UI components
    id: productCategoryItemId !== undefined && productCategoryItemId !== null
      ? productCategoryItemId.toString()
      : '',
    category: categoryName,
    image: imageUrl,
    available: isAvailable,
    preparationTime: Number.isFinite(numericPreparationTime) ? numericPreparationTime : 0,
  };
};

export const transformUser = (backendUser) => {
  const transformed = transformKeysToCamelCase(backendUser);
  return {
    id: transformed.userId?.toString() || transformed.id,
    name: `${transformed.firstName || ''} ${transformed.lastName || ''}`.trim(),
    email: transformed.emailAddress || transformed.email,
    role: transformed.roleName?.toLowerCase() || transformed.role,
    phoneNumber: transformed.phoneNumber || '',
    profilePicture: transformed.profilePictureUrl || transformed.profilePicture,
    isActive: transformed.isActive !== undefined ? transformed.isActive : true,
  };
};

export const transformDashboardStats = (backendStats) => {
  const transformed = transformKeysToCamelCase(backendStats);
  return {
    categories: transformed.categoriesCount || transformed.categories || 0,
    totalProducts: transformed.totalProducts || 0,
    availableProducts: transformed.availableProducts || 0,
    totalOrders: transformed.totalOrders || 0,
    pendingOrders: transformed.pendingOrders || 0,
    preparingOrders: transformed.preparingOrders || 0,
    readyOrders: transformed.readyOrders || 0,
    pickedOrders: transformed.pickedOrders || 0,
    deliveredOrders: transformed.deliveredOrders || 0,
    completedOrders: transformed.completedOrders || 0,
    totalRevenue: transformed.totalRevenue || 0,
    totalSpent: transformed.totalSpent || 0,
    totalEarnings: transformed.totalEarnings || 0,
    availableOrders: transformed.availableOrders || 0,
    myActiveOrders: transformed.myActiveOrders || 0,
    completedDeliveries: transformed.completedDeliveries || 0,
    recentOrders: (transformed.recentOrders || []).map(order => ({
      id: order.orderId?.toString() || order.id,
      customerName: order.customerName || order.studentName,
      shopkeeperName: order.shopkeeperName,
      status: order.orderStatus?.toLowerCase() || order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount || 0,
      dateAdded: order.dateAdded || order.createdAt,
    })),
    recentDeliveries: (transformed.recentDeliveries || []).map(order => ({
      id: order.orderId?.toString() || order.id,
      customerName: order.customerName,
      status: order.orderStatus?.toLowerCase() || order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount || 0,
      dateAdded: order.dateAdded || order.createdAt,
    })),
    topProducts: (transformed.topProducts || []).map(product => ({
      name: product.productName || product.name,
      totalQuantity: product.totalQuantity || 0,
      totalRevenue: product.totalRevenue || 0,
    })),
  };
};

export const transformCreateOrderRequest = (frontendOrder) => {
  const pickupPoint = pickFirstDefined(frontendOrder.pickupPoint, frontendOrder.pickupLocation);
  const destination = pickFirstDefined(frontendOrder.destination, frontendOrder.dropLocation);
  const orderItems = (frontendOrder.items || frontendOrder.orderItems || [])
    .map(item => {
      const productCategoryItemId = toInteger(
        pickFirstDefined(item.productCategoryItemId, item.id)
      );

      if (!productCategoryItemId) {
        return null;
      }

      return {
        productCategoryItemId,
        quantity: toInteger(item.quantity) || 1,
        discount: Number(item.discount) || 0,
      };
    })
    .filter(Boolean);

  return {
    customerId: toInteger(pickFirstDefined(frontendOrder.studentId, frontendOrder.customerId)),
    pickupPoint: pickupPoint || 'Shop',
    ...(destination ? { destination } : {}),
    contactNumber: frontendOrder.contactNumber || '',
    paymentMethod: frontendOrder.paymentMethod || 'Cash',
    specialNotes: frontendOrder.orderNotes || frontendOrder.specialNotes,
    orderPickupType: frontendOrder.orderPickupType || 'Delivery',
    orderItems,
  };
};

export const transformUpdateStatusRequest = (status) => {
  return {
    orderStatus: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
  };
};

export default {
  transformAuthResponse,
  transformOrder,
  transformProduct,
  transformUser,
  transformDashboardStats,
  transformCreateOrderRequest,
  transformUpdateStatusRequest,
  transformKeysToCamelCase,
};
