'use strict';

const productModal = document.querySelector('.modal--product');
const modalHeading = productModal.querySelector('.heading');
const productId = productModal.querySelector('.identifier__value');
const formCloseBtn = productModal.querySelector('.modal__close');

const form = productModal.querySelector('.form');
const discountCheckbox = form.querySelector('#discount_checkbox');
const discountValue = form.querySelector('#discount_value');
const totalPrice = form.querySelector('.summary__value');