import {
  closeErrorModal,
  closeProductModal,
  showErrorModal,
  showProductModal,
} from './modal.js';

import { addProduct, editTableProduct } from './render.js';
import { createProduct, editProduct } from './api.js';
import { fileToBase64 } from './helper.js';

const tableBody = document.querySelector('.table__body');
const tableTotalField = document.querySelector(
  '.container--header-cms .summary__value',
);

export const calculateTableTotal = () => {
  const rows = tableBody.querySelectorAll('.table__column--row-total');
  const tableTotal = Array.from(rows).reduce((total, current) => {
    const value = +current.innerText.slice(1);
    return total + value;
  }, 0);

  tableTotalField.innerText = '$' + tableTotal;
};

document.addEventListener('DOMContentLoaded', () => calculateTableTotal());

tableBody.addEventListener('click', async (e) => {
  const target = e.target;
  if (target.closest('.delete-product')) {
    const row = target.closest('tr');
    row.remove();
    calculateTableTotal();
    return;
  }
  if (target.closest('.edit-product')) {
    showProductModal(target.closest('.edit-product').dataset.productId);
    return;
  }
});

const overlay = document.querySelector('.overlay');

export const showOverlay = () => {
  overlay.classList.add('overlay--visible');
};

export const hideOverlay = () => {
  overlay.classList.remove('overlay--visible');
};

overlay.addEventListener('click', (e) => {
  const target = e.target;
  if (target === overlay) {
    closeErrorModal();
    closeProductModal();
  }
});

const addProductBtn = document.querySelector('.button--add-product');
addProductBtn.addEventListener('click', () => showProductModal());

export const controlProductModal = (modal) => {
  const form = modal.form;
  const discountCheckbox = form.elements.discount_checkbox;
  const discountField = form.elements.discount;
  const itemPriceField = form.elements.price;
  const quantityField = form.elements.count;
  const formTotalPrice = form.summaryValueEl;

  form.calculateFormTotal = () => {
    const itemPrice = +itemPriceField.value;
    const quantity = +quantityField.value;
    if (itemPrice > 0 && quantity > 0) {
      const discount = +discountField.value;
      const finalPrice = Math.round(
        ((itemPrice * quantity) / 100) * (100 - discount),
      );

      formTotalPrice.innerHTML = '$ ' + finalPrice.toLocaleString();
    }
  };

  modal.closeButton.addEventListener('click', () => {
    closeProductModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productData = Object.fromEntries(new FormData(form));
    if (productData.image?.name && productData.image?.size) {
      productData.image = await fileToBase64(productData.image);
    } else {
      productData.image = '';
    }

    if (form.dataset.productId) {
      try {
        const productResponse = await editProduct(
          form.dataset.productId,
          productData,
        );
        editTableProduct(form.dataset.productId, productResponse);
      } catch (error) {
        showErrorModal('Не удалось отредактировать товар: ' + error.message);
        return;
      }
    } else {
      try {
        const productResponse = await createProduct(productData);
        addProduct(productResponse);
      } catch (error) {
        showErrorModal('Не удалось добавить товар: ' + error.message);
        return;
      }
    }

    closeProductModal();
  });

  form.addEventListener('focusout', (e) => {
    const target = e.target;
    if (
      target === itemPriceField ||
      target === discountField ||
      target === quantityField
    ) {
      form.calculateFormTotal();
    }
  });

  discountCheckbox.addEventListener('change', (e) => {
    const target = e.target;
    const isChecked = target.checked;
    if (!isChecked) {
      discountField.value = null;
    }

    form.calculateFormTotal();
    discountField.disabled = !isChecked;
  });

  discountField.addEventListener('keypress', (e) => {
    const value = e.target.value;
    if (value !== undefined && value.toString().length >= 2) {
      e.preventDefault();
    }
  });

  const previewEl = form.imagePreview;

  const processFileInputChange = () => {
    form.errorEL.textContent = '';
    previewEl.style.display = 'none';
    previewEl.src = '';

    if (form.image.files.length > 0) {
      const file = form.image.files[0];
      const fileSize = file.size;
      const maxFileSize = 1024 * 1024; // 1 MB

      if (fileSize > maxFileSize) {
        form.errorEL.textContent =
          'Изображение не должно превышать размер 1 Мб';
        form.image.value = '';
      } else {
        const src = URL.createObjectURL(file);
        previewEl.src = src;
        previewEl.style.display = 'block';
      }
    }
  };

  form.image.addEventListener('change', processFileInputChange);

  form.imageButton.addEventListener('click', (e) => {
    form.image.click();
  });

  form.imgDeleteButton.addEventListener('click', (e) => {
    e.preventDefault();
    form.image.value = '';
    processFileInputChange();
  });
};

export const controlErrorModal = (modal) => {
  modal.closeButton.addEventListener('click', () => {
    closeErrorModal();
  });
};
