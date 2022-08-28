import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { uniqueId } from 'lodash';

import en from './locales/en.js';

import getWatchedState from './view.js';
import parseData from './parser.js';

let feedId = 0;

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
    url: yup
      .string()
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
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const state = {
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      feedback: '',
    },
    rssUrls: [],
    feeds: [],
    posts: [],
  };

  i18next
    .createInstance()
    .init({
      lng: 'en',
      debug: true,
      resources: {
        en,
      },
    })
    .then((t) => {
      const watchedState = getWatchedState(state, elements);

      elements.urlInput.addEventListener('input', () => {
        watchedState.form.processState = 'filling';
      });

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        const validate = getValidateFunc(watchedState.rssUrls, t);
        validate({ url })
          .then(({ url: validUrl }) => {
            watchedState.form.feedback = [''];
            watchedState.form.valid = true;
            watchedState.form.processState = 'sending';
            return axios.get(validUrl);
          })
          .then((res) => {
            const { data, request } = res;
            const { feed, items } = parseData(data, 'text/xml');
            feed.id = feedId;
            const posts = items.map((item) => ({
              ...item,
              id: uniqueId(),
              feedId,
            }));
            feedId += 1;
console.log(feed)
            elements.form.reset();
            elements.form.focus();

            watchedState.form.processState = 'sent';
            watchedState.form.feedback = t('rssSuccessLoaded');
            watchedState.rssUrls.push(request.responseURL);
            watchedState.feeds.push(feed);
            watchedState.posts.push(...posts);
          })
          .catch((error) => {
            console.log(error);
            const { name } = error;
            if (name === 'ValidationError') {
              watchedState.form.feedback = error.errors.map((err) => t(err));
              watchedState.form.valid = false;
            }
            if (name === 'AxiosError') {
              watchedState.form.feedback = t('networkError');
              watchedState.form.processError = error.message;
              watchedState.form.processState = 'error';
            }
            if (name === 'RssParsingError') {
              watchedState.form.feedback = t(error.message);
            }
          });
      });
    });
};
