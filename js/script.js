'use strict';

const productModal = document.querySelector('.modal--product');
const modalHeading = productModal.querySelector('.heading');
const productId = productModal.querySelector('.identifier__value');
const formCloseBtn = productModal.querySelector('.modal__close');

const form = productModal.querySelector('.form');
const discountCheckbox = form.querySelector('#discount_checkbox');
const discountValue = form.querySelector('#discount_value');
const totalPrice = form.querySelector('.summary__value');

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

const tableBody = document.querySelector('.table__body');
tableBody.addEventListener('click', e => {
  const target = e.target;
  if (target.closest('.delete-product')) {
    const row = target.closest('tr');
    row.remove();
    console.log(tableBody.querySelectorAll('tr'));
  }
});
