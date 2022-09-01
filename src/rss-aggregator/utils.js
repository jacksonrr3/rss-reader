import axios from 'axios';

export const createEl = (type, classNames) => {
  const el = document.createElement(type);
  el.classList.add(...classNames);
  return el;
};

const corsProxy = 'https://allorigins.hexlet.app/get';

export const getDataFromProxy = (url) => axios.get(corsProxy, {
  params: {
    disableCache: true,
    url,
  },
});

export default {
  createEl,
  getDataFromProxy,
};
