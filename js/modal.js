import {
  controlErrorModal,
  controlProductModal,
  hideOverlay,
  showOverlay,
} from './control.js';
import { fillFormData } from './helper.js';
import { createErrorModal, createProductModal } from './render.js';

const overlay = document.querySelector('.overlay');

const activeModals = new Set();

let productModal = null;
let errorModal = null;

export const showProductModal = async (e) => {
  if (!productModal) {
    productModal = await createProductModal();
    controlProductModal(productModal);
    overlay.append(productModal);
  }

  let modalHeading = 'Добавить товар';
  const productData = e.productData;
  if (productData?.id) {
    productModal.productIdentifier = productData.id;
    modalHeading = 'Изменить товар';
  }

  productModal.heading.textContent = modalHeading;
  fillFormData(productModal.form, productData);
  productModal.classList.add('modal--visible');
  showOverlay();

  activeModals.add('product');
};

export const closeProductModal = () => {
  productModal.form.reset();
  productModal.classList.remove('modal--visible');

  activeModals.delete('product');
  if (!activeModals.size) {
    hideOverlay();
  }
};

export const showErrorModal = async (error = 'Что-то пошло не так') => {
  if (!errorModal) {
    errorModal = await createErrorModal();
    controlErrorModal(errorModal);
    overlay.append(errorModal);
  }

  errorModal.errorText.textContent = error;
  errorModal.classList.add('modal--visible');
  showOverlay();

  activeModals.add('error');
};

export const closeErrorModal = () => {
  errorModal?.classList.remove('modal--visible');

  activeModals.delete('error');
  if (!activeModals.size) {
    hideOverlay();
  }
};

document.showErrorModal = showErrorModal;
