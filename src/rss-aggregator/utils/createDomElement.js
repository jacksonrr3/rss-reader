export default (type, classNames) => {
  const el = document.createElement(type);
  el.classList.add(...classNames);
  return el;
};
