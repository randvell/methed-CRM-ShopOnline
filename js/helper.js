const styles = new Map();

export const loadStyle = (url) => {
  if (styles.has(url)) {
    return styles.get(url);
  }

  const stylePromise = new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', () => {
      resolve();
    });

    document.head.append(link);
  });

  styles.set(url, stylePromise);
  return stylePromise;
};

export const fillFormData = (form, formData) => {
  form.reset();
  if (!formData) {
    return;
  }

  for (const [key, val] of formData) {
    const input = form.elements[key];
    switch (input.type) {
      case 'checkbox':
        input.checked = !!val;
        break;
      default:
        input.value = val;
        break;
    }
  }
};
