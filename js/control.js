import { createProduct } from './api.js';
import { addProduct } from './render.js';

const productModal = document.querySelector('.modal--product');
const errorModal = document.querySelector('.modal--error');
const errorModalText = errorModal.querySelector('.error-text');

const form = document.forms.product_modal;
const discountCheckbox = form.elements.discount_checkbox;
const discountField = form.elements.discount;
const itemPriceField = form.elements.price;
const quantityField = form.elements.count;

const formTotalPrice = form.querySelector('.summary__value');
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

tableBody.addEventListener('click', (e) => {
  const target = e.target;
  if (target.closest('.delete-product')) {
    const row = target.closest('tr');
    row.remove();
    calculateTableTotal();

    console.log(tableBody.querySelectorAll('tr'));
  }
});

const overlay = document.querySelector('.overlay');

const showOverlay = () => {
  overlay.classList.add('overlay--visible');
};

const hideOverlay = () => {
  overlay.classList.remove('overlay--visible');
};

const showProductModal = () => {
  productModal.classList.add('modal--visible');
  showOverlay();
};

const closeProductModal = () => {
  form.reset();
  productModal.classList.remove('modal--visible');
};

const showErrorModal = (error = 'Что-то пошло не так') => {
  errorModalText.textContent = error;
  errorModal.classList.add('modal--visible');
  showOverlay();
};

const closeErrorModal = () => {
  errorModal.classList.remove('modal--visible');
};

const addProductBtn = document.querySelector('.button--add-product');
addProductBtn.addEventListener('click', showProductModal);

overlay.addEventListener('click', (e) => {
  const target = e.target;
  if (target === overlay || target.closest('.modal__close')) {
    closeErrorModal();
    closeProductModal();
    hideOverlay();
  }
});

const calculateFormTotal = () => {
  const itemPrice = +itemPriceField.value;
  const quantity = +quantityField.value;
  if (itemPrice > 0 && quantity > 0) {
    const discount = +discountField.value;
    const finalPrice = Math.round(
      ((itemPrice * quantity) / 100) * (100 - discount),
    );

    formTotalPrice.innerHTML = '$' + Math.round(finalPrice);
  }
};

discountCheckbox.addEventListener('change', (e) => {
  const target = e.target;
  const isChecked = target.checked;
  if (!isChecked) {
    discountField.value = null;
  }

  calculateFormTotal();
  discountField.disabled = !isChecked;
});

discountField.addEventListener('keypress', (e) => {
  const value = e.target.value;
  if (value !== undefined && value.toString().length >= 2) {
    e.preventDefault();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));
  try {
    const productResponse = await createProduct(formData);
    addProduct(productResponse);
  } catch (error) {
    showErrorModal('Не удалось добавить товар: ' + error.message);
    return;
  }

  closeProductModal();
  hideOverlay();
});

form.addEventListener('focusout', (e) => {
  const target = e.target;
  if (
    target === itemPriceField ||
    target === discountField ||
    target === quantityField
  ) {
    calculateFormTotal();
  }
});