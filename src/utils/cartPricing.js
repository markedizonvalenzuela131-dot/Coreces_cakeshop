export const FREE_DELIVERY_THRESHOLD = 5600;
export const DELIVERY_FEE = 560;

const VALID_PROMO_CODES = new Set(['SWEET10', 'WELCOME']);

export function calculateCartPricing(subtotal, promoCode = '') {
  const discount = VALID_PROMO_CODES.has(promoCode) ? Math.round(subtotal * 0.1) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableSubtotal * 0.08);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  return {
    discount,
    tax,
    deliveryFee,
    total: taxableSubtotal + tax + deliveryFee,
  };
}
