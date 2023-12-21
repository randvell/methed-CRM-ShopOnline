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
  overlay.classList.add('overlay--visible')
}
const hideOverlay = () => {
  overlay.classList.remove('overlay--visible')
}

productModal.addEventListener('click', event => {
  event.stopPropagation();
});

const addProductBtn = document.querySelector('.button--add-product');
addProductBtn.addEventListener('click', showOverlay);
overlay.addEventListener('click', hideOverlay);
formCloseBtn.addEventListener('click', hideOverlay);