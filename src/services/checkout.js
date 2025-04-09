
export const processCheckout = async (orderData) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const isValid = orderData.items.every(item => item.price > 0 && item.quantity > 0);
  
  if (!isValid) {
    throw new Error('Invalid order data');
  }

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(orderData.address.pincode);
  const total = subtotal + tax + shipping;

  return {
    orderId: `ORD-${Date.now()}`,
    status: 'CONFIRMED',
    timestamp: new Date().toISOString(),
    subtotal,
    tax,
    shipping,
    total,
    estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    paymentId: `PAY-${Date.now()}`
  };
};

export const calculateTax = (subtotal) => {
  const TAX_RATE = 0.18; 
  return parseFloat((subtotal * TAX_RATE).toFixed(2));
};

export const calculateShipping = (pincode) => {
  const firstDigit = parseInt(pincode.toString()[0]);
  const baseRate = 40;
  const zoneMultiplier = Math.max(1, firstDigit / 2);
  return parseFloat((baseRate * zoneMultiplier).toFixed(2));
};

export const validateAddress = (address) => {
  const required = ['fullName', 'street', 'city', 'state', 'pincode', 'phone'];
  const missing = required.filter(field => !address[field]);
  
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
    throw new Error('Invalid pincode format');
  }

  if (!/^[6-9]\d{9}$/.test(address.phone)) {
    throw new Error('Invalid phone number format');
  }

  return true;
};

export const validateOrder = (items, totalAmount) => {
  if (!items.length) {
    throw new Error('Cart is empty');
  }

  if (totalAmount <= 0) {
    throw new Error('Invalid order amount');
  }

  return true;
};
