'use strict';

const productModal = document.querySelector('.modal--product');
const modalHeading = productModal.querySelector('.heading');
const productId = productModal.querySelector('.identifier__value');
const formCloseBtn = productModal.querySelector('.modal__close');

const form = productModal.querySelector('.form');
const discountCheckbox = form.querySelector('#discount_checkbox');
const discountField = form.querySelector('#discount_value');
const itemPriceField = form.querySelector('#price');
const quantityField = form.querySelector('#quantity');
const formTotalPrice = form.querySelector('.summary__value');

const tableBody = document.querySelector('.table__body');

const tableTotalField =
  document.querySelector('.container--header-cms .summary__value');

const calculateTableTotal = () => {
  const rows = tableBody.querySelectorAll('.table__column--row-total');
  const tableTotal = Array.from(rows).reduce((total, current) => {
    const value = +(current.innerText.slice(1));
    return total + value;
  }, 0);

  tableTotalField.innerText = '$' + tableTotal;
};

const createRow = (rowData) => {
  const {
    id = 123,
    name,
    category,
    price,
    discount = 0,
    quantity,
    unit,
  } = rowData;

  const rowPrice = price / 100 * (100 - discount);
  const rowTotalPrice = rowPrice * quantity;

  const rowValues = [id, name, category, unit,
    quantity, '$' + rowPrice, '$' + rowTotalPrice];

  const tableBody = document.querySelector('.table__body');
  const tableRow = tableBody.querySelector('.table__row').cloneNode(true);
  const rowColumns = tableRow.querySelectorAll('.table__column');

  tableRow.innerText = '';
  for (let i = 0; i < rowColumns.length; i++) {
    const column = rowColumns[i];
    let currentValue = rowValues;
    if (currentValue === undefined) {
      currentValue = null;
    }

    if (rowValues[i]) {
      column.textContent = rowValues[i];
    }

    tableRow.appendChild(column);
  }

  tableBody.appendChild(tableRow);
  calculateTableTotal();
};

document.addEventListener('DOMContentLoaded', () => calculateTableTotal());

tableBody.addEventListener('click', e => {
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

const addProductBtn = document.querySelector('.button--add-product');
addProductBtn.addEventListener('click', showOverlay);

overlay.addEventListener('click', e => {
  const target = e.target;
  if (target === overlay || target.closest('.modal__close')) {
    hideOverlay();
  }
});

const calculateFormTotal = () => {
  const itemPrice = +itemPriceField.value;
  const quantity = +quantityField.value;
  if (itemPrice > 0 && quantity > 0) {
    const discount = +discountField.value;
    const finalPrice = Math.round(itemPrice * quantity /
      100 * (100 - discount));

    formTotalPrice.innerHTML = '$' + Math.round(finalPrice);
  }
};

discountCheckbox.addEventListener('change', e => {
  const target = e.target;
  const isChecked = target.checked;
  if (!isChecked) {
    discountField.value = null;
  }

  calculateFormTotal();
  discountField.disabled = !isChecked;
});

discountField.addEventListener('keypress', e => {
  const value = e.target.value;
  if (value !== undefined && value.toString().length >= 2) {
    e.preventDefault();
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));
  form.reset();
  hideOverlay();
  createRow(formData);
});

form.addEventListener('focusout', e => {
  const target = e.target;
  if (target === itemPriceField || target === discountField ||
    target === quantityField) {
    calculateFormTotal();
  }
});
