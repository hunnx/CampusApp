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
  return {
    id: transformed.orderId?.toString() || transformed.id,
    orderId: transformed.orderId?.toString() || transformed.orderId,
    studentId: transformed.customerId?.toString() || transformed.customerId,
    studentName: transformed.customerName || transformed.studentName,
    shopkeeperId: transformed.shopkeeperId?.toString() || transformed.shopkeeperId,
    shopkeeperName: transformed.shopkeeperName,
    delivererId: transformed.delivererId?.toString() || transformed.delivererId,
    status: transformed.orderStatus?.toLowerCase() || transformed.status,
    items: (transformed.orderItems || transformed.items || []).map(item => ({
      id: item.orderItemId?.toString() || item.id,
      productCategoryItemId: item.productCategoryItemId?.toString() || item.productId?.toString() || item.productId,
      name: item.productName || item.name,
      price: item.unitPrice || item.price,
      quantity: item.quantity,
      subtotal: item.subtotal || (item.unitPrice * item.quantity),
    })),
    totalAmount: transformed.totalAmount || 0,
    deliveryCharge: transformed.deliveryFee || 0,
    pickupLocation: pickFirstDefined(transformed.pickupPoint, transformed.pickupLocation, ''),
    dropLocation: pickFirstDefined(transformed.destination, transformed.dropLocation, ''),
    contactNumber: transformed.contactNumber || '',
    orderNotes: transformed.specialNotes || transformed.orderNotes,
    paymentMethod: transformed.paymentMethod || 'Cash',
    paymentStatus: transformed.paymentStatus || 'Pending',
    createdAt: transformed.dateAdded || transformed.createdAt,
    updatedAt: transformed.dateUpdated || transformed.updatedAt,
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
