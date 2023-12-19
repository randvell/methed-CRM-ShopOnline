'use strict';

// const productModal = document.querySelector('.modal--product');
// const modalHeading = productModal.querySelector('.heading');
// const productId = productModal.querySelector('.identifier__value');
// const formCloseBtn = productModal.querySelector('.modal__close');

// const form = productModal.querySelector('.form');
// const discountCheckbox = form.querySelector('#discount_checkbox');
// const discountValue = form.querySelector('#discount_value');
// const totalPrice = form.querySelector('.summary__value');

const createRow = (rowData) => {
  const {id, title, category, price, discount = 0, count, units} = rowData;
  const rowPrice = price / 100 * (100 - discount);
  const rowTotalPrice = rowPrice * count;

  const rowValues = [id, title, category, units,
    count, '$' + rowPrice, '$' + rowTotalPrice];

  const tableBody = document.querySelector('.table__body');
  const tableRow = tableBody.querySelector('.table__row').cloneNode(true);
  const rowColumns = tableRow.querySelectorAll('.table__column');

  tableRow.innerText = '';
  for (let i = 0; i < rowColumns.length; i++) {
    const column = rowColumns[i];
    if (rowValues[i]) {
      column.textContent = rowValues[i];
    }

    tableRow.appendChild(column);
  }

  tableBody.appendChild(tableRow);
};

const renderGoods = (goods) => goods.map((good) => {
  createRow(good);
});

renderGoods(goods);
