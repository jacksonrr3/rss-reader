import * as yup from 'yup';
import getWatchedState from './view.js';

const invalidUrlText = 'Ссылка должна быть валидным URL';
const rssIsExist = 'RSS уже существует';

const getValidateFunc = (rssLinks) => (url) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url(invalidUrlText)
      .notOneOf(rssLinks, rssIsExist),
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

  const watchedState = getWatchedState(state, elements);
  const validate = getValidateFunc(watchedState.rss);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validate({ url })
      .then(({ rss: validUrl }) => {
        console.log('then url', validUrl);
        watchedState.form.feedback = [''];
        watchedState.form.valid = true;

        elements.urlInput.value = '';
      })
      .catch((error) => {
        watchedState.form.feedback = error.errors;
        watchedState.form.valid = false;
      });
  });
};
