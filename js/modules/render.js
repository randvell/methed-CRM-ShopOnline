export const createRow = (rowData) => {
  const { id, name, category, price, discount = 0, quantity, unit } = rowData;

  const rowPrice = (price / 100) * (100 - discount);
  const rowTotalPrice = rowPrice * quantity;

  const rowValues = [
    id,
    name,
    category,
    unit,
    quantity,
    "$" + rowPrice,
    "$" + rowTotalPrice,
  ];

  const tableBody = document.querySelector(".table__body");
  const tableRow = tableBody.querySelector(".table__row").cloneNode(true);
  const rowColumns = tableRow.querySelectorAll(".table__column");

  tableRow.innerText = "";
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
};

export const setFormTotal = (form, price) => {
  const formTotalPrice = form.querySelector(".summary__value");
  formTotalPrice.innerHTML = "$" + Math.round(price);
};

export const setTableTotal = (tableTotal) => {
  const tableTotalField = document.querySelector(
    ".container--header-cms .summary__value"
  );
  tableTotalField.innerText = "$" + tableTotal;
};
