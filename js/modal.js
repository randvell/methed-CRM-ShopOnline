import { getProductInfo } from './api.js';
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

export const showProductModal = async (productId) => {
  if (!productModal) {
    productModal = await createProductModal();
    controlProductModal(productModal);
    overlay.append(productModal);
  }

  let productData = null;
  if (productId) {
    productData = await getProductInfo(productId);
  }

  let modalHeading = 'Добавить товар';
  if (productData?.id) {
    productModal.productIdentifier.textContent = 'ID: ' + productData.id;
    modalHeading = 'Изменить товар';
  }

  productModal.form.submitButton.textContent = modalHeading;
  productModal.form.dataset.productId = productData?.id || '';
  productModal.heading.textContent = modalHeading;
  productModal.form?.reset();
  fillFormData(productModal.form, productData);
  productModal.form.calculateFormTotal();

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
