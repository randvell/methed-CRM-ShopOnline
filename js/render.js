import { calculateTableTotal } from './control.js';
import { iconDelete, iconEdit, iconImg, iconNoImg } from './svg.js';

const tableBody = document.querySelector('.table__body');
const templateRow = tableBody.querySelector('.table__row');

const createButtons = (hasImage) => {
  const imgButton = document.createElement('button');
  imgButton.classList.add('button', 'edit-image');
  imgButton.innerHTML = hasImage ? iconImg : iconNoImg;

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'edit-product');
  editButton.innerHTML = iconEdit;

  const delButton = document.createElement('button');
  delButton.classList.add('button', 'delete-product');
  delButton.innerHTML = iconDelete;

  return [imgButton, editButton, delButton];
};

export const createRow = (rowData) => {
  const {
    id,
    title,
    category,
    price,
    discount = 0,
    count,
    units,
    image,
  } = rowData;

  const rowPrice = (price / 100) * (100 - discount);
  const rowTotalPrice = rowPrice * count;

  const rowValues = [
    id,
    title,
    category,
    units,
    count,
    '$' + rowPrice,
    '$' + rowTotalPrice,
    createButtons(!!image),
  ];

  const tableRow = templateRow.cloneNode(true);
  const rowColumns = tableRow.querySelectorAll('.table__column');

  tableRow.innerText = '';
  for (let i = 0; i < rowColumns.length; i++) {
    const column = rowColumns[i];
    let currentValue = rowValues;
    if (currentValue === undefined) {
      currentValue = null;
    }

    if (rowValues[i]) {
      if (Array.isArray(rowValues[i])) {
        column.append(...rowValues[i]);
      } else {
        column.textContent = rowValues[i];
      }
    }

    tableRow.appendChild(column);
  }

  return tableRow;
};

export const addProduct = (productData) => {
  tableBody.append(createRow(productData));
};

export const renderProducts = (productsData) => {
  tableBody.querySelectorAll('.table__row').forEach((el) => {
    el.remove();
  });

  productsData.forEach((productData) => {
    addProduct(productData);
  });

  calculateTableTotal();
};
