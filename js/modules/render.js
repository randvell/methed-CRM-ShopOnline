import { tableBody } from "./control.js";

export const appendRow = (rowData) => {
  const { id, name, category, price, discount = 0, quantity, unit } = rowData;

  const rowPrice = Math.round((price / 100) * (100 - discount));
  const rowTotalPrice = Math.round(rowPrice * quantity);

  const rowValues = [
    id,
    name,
    category,
    unit,
    quantity,
    "$" + rowPrice,
    "$" + rowTotalPrice,
  ];

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
