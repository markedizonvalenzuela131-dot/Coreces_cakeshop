import { calculateCartPricing, FREE_DELIVERY_THRESHOLD } from './cartPricing';

test('calculates tax and delivery for a cart without a promotion', () => {
  expect(calculateCartPricing(3000)).toEqual({
    discount: 0,
    tax: 240,
    deliveryFee: 560,
    total: 3800,
  });
});

test('applies valid promotions before tax and keeps free-delivery eligibility based on subtotal', () => {
  expect(calculateCartPricing(FREE_DELIVERY_THRESHOLD, 'SWEET10')).toEqual({
    discount: 560,
    tax: 403,
    deliveryFee: 0,
    total: 5443,
  });
});

test('ignores unrecognized promotions', () => {
  expect(calculateCartPricing(3000, 'INVALID').discount).toBe(0);
});
