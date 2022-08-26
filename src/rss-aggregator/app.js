import * as yup from 'yup';
import i18next from 'i18next';

import en from './locales/en.js';

import getWatchedState from './view.js';

yup.setLocale({
  mixed: {
    notOneOf: 'validateErrors.rssIsExist',
  },
  string: {
    url: 'validateErrors.invalidUrl',
  },
});

const getValidateFunc = (rssLinks) => (url) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url()
      .notOneOf(rssLinks),
  });
  return schema.validate(url);
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      valid: true,
      prosessState: 'filling',
      processError: null,
      feedback: '',
    },
    rss: [],
  };

  const i18nInstance = i18next.createInstance();

  i18nInstance
    .init({
      lng: 'en',
      debug: true,
      resources: {
        en,
      },
    })
    .then((t) => {
      const watchedState = getWatchedState(state, elements);

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const validate = getValidateFunc(watchedState.rss, t);
        validate({ url })
          .then(({ rss: validUrl }) => {
            console.log(validUrl);
            watchedState.form.feedback = [''];
            watchedState.form.valid = true;

            elements.urlInput.value = '';
          })
          .catch(({ errors }) => {
            watchedState.form.feedback = errors.map((err) => t(err));
            watchedState.form.valid = false;
          });
      });
    });
};
