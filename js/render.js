import { calculateTableTotal } from './control.js';
import { loadStyle } from './helper.js';
import { errorSvg, iconDelete, iconEdit, iconImg, iconNoImg } from './svg.js';

const tableBody = document.querySelector('.table__body');
const templateRow = tableBody.querySelector('.table__row');

const createButtons = ({ id, image }) => {
  const imgButton = document.createElement('button');
  imgButton.classList.add('button', 'edit-image');
  imgButton.innerHTML = image ? iconImg : iconNoImg;

  const editButton = document.createElement('button');
  editButton.classList.add('button', 'edit-product');
  editButton.dataset.productId = id;
  editButton.innerHTML = iconEdit;

  const delButton = document.createElement('button');
  delButton.classList.add('button', 'delete-product');
  delButton.dataset.productId = id;
  delButton.innerHTML = iconDelete;

  return [imgButton, editButton, delButton];
};

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

export const createRow = (rowData) => {
  const tableRow = templateRow.cloneNode(true);
  fillTableRow(tableRow, rowData);

  return tableRow;
};

export const addProduct = (productData) => {
  tableBody.append(createRow(productData));
};

export const editTableProduct = (id, productData) => {
  const tableRow = document.querySelector(
    `.table__row[data-product-id="${id}"]`,
  );

  if (!tableRow) {
    throw new Error('Не обнаружена запись таблицы для ID ' + id);
  }

  fillTableRow(tableRow, productData);
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

export const createModal = async (className) => {
  await loadStyle('../styles/modal.css');

  const modal = document.createElement('div');
  const modalClasses = ['modal'];
  if (className) {
    modalClasses.push(className);
  }

  modal.classList.add('modal');

  const closeButton = document.createElement('button');
  closeButton.dataset.close = true;
  closeButton.type = 'button';
  closeButton.classList.add('modal__close');

  const container = document.createElement('div');
  container.classList.add('container');

  modal.container = container;
  modal.closeButton = closeButton;
  modal.append(closeButton, container);

  return modal;
};

const createInputEl = ({ name, isRequired = false, type = 'text' }) => {
  const elementTag = type === 'textarea' ? type : 'input';
  const input = document.createElement(elementTag);
  input.classList.add('form__input', `form__input--${type}`);
  if (elementTag === 'input') {
    input.type = type;
  }

  input.id = name;
  input.name = name;
  if (isRequired) {
    input.required = true;
  }

  return input;
};

const createFormInput = ({
  name,
  label,
  isRequired = false,
  type = 'text',
}) => {
  const labelEl = document.createElement('label');
  labelEl.classList.add('label', 'form__label', `form__label--${name}`);
  labelEl.for = name;

  const span = document.createElement('span');
  span.classList.add('label__text');
  span.textContent = label;

  const input = createInputEl({ name, type, isRequired });
  labelEl.append(span, input);

  return labelEl;
};

const createDiscountInput = () => {
  const container = document.createElement('div');
  container.classList.add(
    'form__checkbox-wrapper',
    'form__checkbox-wrapper--discount',
  );

  const label = document.createElement('label');
  label.classList.add('label', 'form__label', 'form__label--wrapped');
  const span = document.createElement('span');
  span.classList.add('label__text');
  span.textContent = 'Дисконт';
  label.append(span);

  const checkbox = createInputEl({
    name: 'discount_checkbox',
    type: 'checkbox',
  });

  const discountInput = createInputEl({
    name: 'discount',
    type: 'number',
    isRequired: true,
  });
  discountInput.min = 1;
  discountInput.max = 99;
  discountInput.disabled = 'disabled';

  container.checkbox = checkbox;
  container.append(label, checkbox, discountInput);
  return container;
};

const createProductForm = () => {
  const form = document.createElement('form');
  form.classList.add('form');
  form.name = 'product_form';

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('form__fieldset');
  fieldset.append(
    createFormInput({
      name: 'title',
      label: 'Наименование',
      isRequired: true,
    }),
    createFormInput({
      name: 'category',
      label: 'Категория',
      isRequired: true,
    }),
    createFormInput({
      name: 'units',
      label: 'Единицы измерения',
      isRequired: true,
    }),
    createFormInput({
      name: 'price',
      label: 'Цена',
      type: 'number',
      isRequired: true,
    }),
    createFormInput({
      name: 'count',
      label: 'Количество',
      type: 'number',
      isRequired: true,
    }),
    createFormInput({
      name: 'description',
      label: 'Описание',
      type: 'textarea',
      isRequired: true,
    }),
    createDiscountInput(),
  );

  const errorEl = document.createElement('span');
  errorEl.classList.add('form__error');
  const imageButton = document.createElement('button');
  imageButton.classList.add('form__button', 'form__button--add-image');
  imageButton.type = 'button';
  imageButton.textContent = 'Добавить изображение';
  fieldset.append(errorEl, imageButton);

  const formSummary = document.createElement('div');
  formSummary.classList.add('form__summary');

  const summaryTextContainer = document.createElement('div');
  summaryTextContainer.classList.add('summary');

  const summaryText = document.createElement('span');
  summaryText.classList.add('summary__text');
  summaryText.textContent = 'Итоговая стоимость:';
  const summaryValue = document.createElement('span');
  summaryValue.classList.add('summary__value');
  summaryValue.textContent = '$ 0';

  summaryTextContainer.append(summaryText, summaryValue);

  const submitButton = document.createElement('button');
  submitButton.classList.add('form__button', 'form__button--submit');
  submitButton.type = 'submit';
  submitButton.textContent = 'Добавить товар';

  formSummary.append(summaryTextContainer, submitButton);

  form.submitButton = submitButton;
  form.summaryValueEl = summaryValue;
  form.errorEL = errorEl;
  form.append(fieldset, formSummary);

  return form;
};

export const createProductModal = async () => {
  await loadStyle('../styles/product-form.css');

  const modal = await createModal('modal--product');
  modal.classList.add('modal--product');
  const container = modal.container;
  container.classList.add('container--form');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container', 'container--modal-header');

  const heading = document.createElement('h2');
  heading.classList.add('heading');
  heading.textContent = 'Добавить товар';

  const productIdentifier = document.createElement('p');
  productIdentifier.classList.add('product-identifier');
  modal.productIdentifier = productIdentifier;

  headerContainer.append(heading, productIdentifier);

  const breakEl = document.createElement('div');
  breakEl.classList.add('break');

  const form = createProductForm();
  modal.form = form;
  modal.heading = heading;

  container.append(headerContainer, breakEl, form);
  return modal;
};

export const createErrorModal = async () => {
  const modal = await createModal();
  modal.classList.add('modal--error');
  modal.container.innerHTML += errorSvg;

  const errorText = document.createElement('p');
  errorText.classList.add('error-text');
  modal.container.append(errorText);

  modal.errorText = errorText;

  return modal;
};
