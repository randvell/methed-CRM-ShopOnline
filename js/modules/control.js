import { appendRow } from './render.js';

export const tableBody = document.querySelector('.table__body');

const form = document.forms.product_modal;

const discountCheckbox = form.elements.discount_checkbox;
const discountField = form.elements.discount;
const itemPriceField = form.elements.price;
const quantityField = form.elements.quantity;

export const formTotalPriceField = form.querySelector('.summary__value');

const overlay = document.querySelector('.overlay');
const addProductBtn = document.querySelector('.button--add-product');

const setFormTotal = (price) => {
  formTotalPriceField.innerHTML = '$' + Math.round(price);
};

const setTableTotal = (total) => {
  const tableTotalField = document.querySelector(
    '.container--header-cms .summary__value'
  );
  tableTotalField.innerText = '$' + total;
};

const calculateTableTotal = () => {
  const rows = tableBody.querySelectorAll('.table__column--row-total');
  const tableTotal = Array.from(rows).reduce((total, current) => {
    const value = +current.innerText.slice(1);
    return total + value;
  }, 0);

  setTableTotal(tableTotal);
};

export const formControl = () => {
  const calculateFormTotal = () => {
    const itemPrice = +itemPriceField.value;
    const quantity = +quantityField.value;
    if (itemPrice > 0 && quantity > 0) {
      const discount = +discountField.value;
      const finalPrice = Math.round(
        ((itemPrice * quantity) / 100) * (100 - discount)
      );

      setFormTotal(finalPrice);
    }
  };

  const showOverlay = () => {
    overlay.classList.add('overlay--visible');
  };

  const hideOverlay = () => {
    overlay.classList.remove('overlay--visible');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    form.reset();
    hideOverlay();
    appendRow(formData);
    calculateTableTotal();
  });

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

  addProductBtn.addEventListener('click', showOverlay);

  overlay.addEventListener('click', (e) => {
    const target = e.target;
    if (target === overlay || target.closest('.modal__close')) {
      hideOverlay(overlay);
    }
  });
};

const openNewWindowImage = (imageSource) => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const windowWidth = 600;
  const windowHeight = 600;

  const left = (screenWidth - windowWidth) / 2;
  const top = (screenHeight - windowHeight) / 2;

  // Options for the new window
  const windowFeatures =
    'width=' +
    windowWidth +
    ',height=' +
    windowHeight +
    ',top=' +
    top +
    ',left=' +
    left;

  const imageUrl = 'images/' + imageSource;

  const newWindow = open(imageUrl, '', windowFeatures);
};

export const tableControl = () => {
  tableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.delete-product')) {
      const row = target.closest('tr');
      row.remove();
      calculateTableTotal();
      return;
    }

    const closestButton = target.closest('.edit-image');
    if (closestButton && closestButton.dataset.pic) {
      openNewWindowImage(closestButton.dataset.pic);
    }
  });

  calculateTableTotal();
};
