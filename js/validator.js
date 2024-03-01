export const onlyCyrillic = ({ target }, spaceAllowed = true) => {
  return (target.value = spaceAllowed
    ? target.value.replace(/[^а-яА-Я ]/g, '')
    : target.value.replace(/[^а-яА-Я]/g, ''));
};

export const onlyNumber = ({ target }) => {
  target.value = target.value.replace(/[^\d]/g, '');
};
