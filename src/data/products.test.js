import fs from 'fs';
import path from 'path';
import { products } from './products';
import { formatPeso } from '../utils/formatCurrency';

test('every product uses an available local cake photo', () => {
  products.forEach(product => {
    const imageName = product.image.split('/').pop();
    const imagePath = path.join(__dirname, '../../public/images/cakes', imageName);

    expect(fs.existsSync(imagePath)).toBe(true);
    expect(fs.statSync(imagePath).size).toBeGreaterThan(0);
  });
});

test('formats prices in Philippine pesos', () => {
  expect(formatPeso(2520)).toContain('₱');
  expect(formatPeso(2520)).toContain('2,520');
});
