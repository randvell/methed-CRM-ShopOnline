import { tableControl, formControl } from "./modules/control.js";

{
  const init = () => {
    const tableBody = document.querySelector(".table__body");

    const form = document.forms.product_modal;
    const overlay = document.querySelector(".overlay");
    const addProductBtn = document.querySelector(".button--add-product");

    tableControl(tableBody);
    formControl(form, overlay, addProductBtn);
  };

  window.cmsInit = init;
}

document.addEventListener("DOMContentLoaded", () => {
  window.cmsInit();
});
