import { createRow, setFormTotal, setTableTotal } from "./render.js";

export const formControl = (form, overlay, addProductBtn) => {
  const discountCheckbox = form.elements.discount_checkbox;
  const discountField = form.elements.discount;
  const itemPriceField = form.elements.price;
  const quantityField = form.elements.quantity;

  const calculateFormTotal = () => {
    const itemPrice = +itemPriceField.value;
    const quantity = +quantityField.value;
    if (itemPrice > 0 && quantity > 0) {
      const discount = +discountField.value;
      const finalPrice = Math.round(
        ((itemPrice * quantity) / 100) * (100 - discount)
      );

      setFormTotal(form, finalPrice);
    }
  };

  const showOverlay = () => {
    overlay.classList.add("overlay--visible");
  };

  const hideOverlay = () => {
    overlay.classList.remove("overlay--visible");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    form.reset();
    hideOverlay();
    createRow(formData);
  });

  discountCheckbox.addEventListener("change", (e) => {
    const target = e.target;
    const isChecked = target.checked;
    if (!isChecked) {
      discountField.value = null;
    }

    calculateFormTotal();
    discountField.disabled = !isChecked;
  });

  discountField.addEventListener("keypress", (e) => {
    const value = e.target.value;
    if (value !== undefined && value.toString().length >= 2) {
      e.preventDefault();
    }
  });

  form.addEventListener("focusout", (e) => {
    const target = e.target;
    if (
      target === itemPriceField ||
      target === discountField ||
      target === quantityField
    ) {
      calculateFormTotal();
    }
  });

  addProductBtn.addEventListener("click", showOverlay);

  overlay.addEventListener("click", (e) => {
    const target = e.target;
    if (target === overlay || target.closest(".modal__close")) {
      hideOverlay(overlay);
    }
  });
};

export const tableControl = (tableBody) => {
  const calculateTableTotal = () => {
    const rows = tableBody.querySelectorAll(".table__column--row-total");
    const tableTotal = Array.from(rows).reduce((total, current) => {
      const value = +current.innerText.slice(1);
      return total + value;
    }, 0);

    setTableTotal(tableTotal);
  };

  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.closest(".delete-product")) {
      const row = target.closest("tr");
      row.remove();
      calculateTableTotal();

      console.log(tableBody.querySelectorAll("tr"));
    }
  });

  calculateTableTotal();
};
