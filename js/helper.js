import { API_URL } from './api.js';
import { createButtons } from './render.js';

const styles = new Map();

export const loadStyle = (url) => {
  if (styles.has(url)) {
    return styles.get(url);
  }

  const stylePromise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', () => {
      resolve();
    });

    document.head.append(link);
  });

  styles.set(url, stylePromise);
  return stylePromise;
};

export const fillFormData = (form, formData) => {
  if (formData?.image && formData.image !== 'image/notimage.jpg') {
    form.imagePreview.src = `${API_URL}/${formData.image}`;
    form.imagePreview.style.display = 'block';
  } else {
    form.imagePreview.src = '';
    form.imagePreview.style.display = 'none';
  }

  if (!formData) {
    return;
  }

  for (const [key, val] of Object.entries(formData)) {
    const input = form.elements[key];
    if (!input) {
      continue;
    }

    switch (input.type) {
      case 'checkbox':
        input.checked = !!val;
        break;
      case 'file':
        // todo: понять как это должно работать
        break;
      default:
        input.value = val;
        break;
    }
  }

  if (+formData.discount > 0) {
    form.elements['discount_checkbox'].checked = true;
  }

  form.elements['discount_checkbox'].dispatchEvent(new Event('change'));
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', () => {
      resolve(reader.result);
    });

    reader.addEventListener('error', (err) => {
      reject(err);
    });

    reader.readAsDataURL(file);
  });

export const fillTableRow = (tableRow, rowData) => {
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
    createButtons({ id, image }),
  ];

  const rowColumns = tableRow.querySelectorAll('.table__column');

  tableRow.dataset.productId = id;
  tableRow.innerText = '';
  for (let i = 0; i < rowColumns.length; i++) {
    const column = rowColumns[i];
    let currentValue = rowValues;
    if (currentValue === undefined) {
      currentValue = null;
    }

    if (rowValues[i]) {
      if (Array.isArray(rowValues[i])) {
        column.innerHTML = '';
        column.append(...rowValues[i]);
      } else {
        column.textContent = rowValues[i];
      }
    }

    tableRow.appendChild(column);
  }
};
