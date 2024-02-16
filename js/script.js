import './control.js';
import { getGoods } from './api.js';
import { renderProducts } from './render.js';

document.addEventListener('DOMContentLoaded', async () => {
  const productsData = await getGoods();
  if (!productsData.goods) {
    return;
  }

  renderProducts(productsData.goods);
});
