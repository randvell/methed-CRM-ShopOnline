const API_URL = 'https://button-hypnotic-pixie.glitch.me/';

export const getGoods = async (size = 'all') => {
  const response = await fetch(`${API_URL}/api/goods?size=` + size);
  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.statusText}`);
  }

  const result = await response.json();
  if (!result || (size !== 'all' && !result.goods)) {
    throw new Error(`В ответе сервера не обнаружены товары`);
  }

  if (size === 'all') {
    return { goods: result };
  }

  return result;
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/api/goods`, {
    method: 'POST',
    body: JSON.stringify(productData),
  });

  const result = await response.json();
  if (!response.ok || response.status < 200 || response.status > 300) {
    if (result?.errors) {
      throw new Error(JSON.stringify(result.errors));
    }

    throw new Error(
      `Ошибка сервера: ${response.statusText || response.status}`,
    );
  }

  return result;
};
