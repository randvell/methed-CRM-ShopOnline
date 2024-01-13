import { tableControl, formControl } from "./modules/control.js";

{
  const init = () => {
    tableControl();
    formControl();
  };

  window.cmsInit = init;
}

document.addEventListener("DOMContentLoaded", () => {
  window.cmsInit();
});
