import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import _, { uniqueId } from 'lodash';

import en from './locales/en.js';

import getWatchedState from './view.js';
import parseData from './parser.js';

const allOriginProxyUrl = 'https://allorigins.hexlet.app/get';
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
    modal: {
      modalTitle: document.querySelector('.modal-title'),
      modalDescription: document.querySelector('.text-break'),
      modalLink: document.querySelector('.full-article'),
    },
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
    viewedPostId: null,
    viewedPosts: {},
  };

  i18next
    .createInstance()
    .init({
      lng: 'en',
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
            return axios.get(allOriginProxyUrl, {
              params: {
                disableCache: true,
                url: validUrl,
              },
            });
          })
          .then((res) => {
            const { data } = res;
            const { feed, items } = parseData(data.contents, 'text/xml');
            feed.id = feedId;
            feed.url = data.status.url;
            const posts = items.map((item) => ({
              ...item,
              id: uniqueId(),
              feedId,
            }));
            feedId += 1;
            elements.form.reset();
            elements.form.focus();

            watchedState.form.processState = 'sent';
            watchedState.form.feedback = t('rssSuccessLoaded');
            watchedState.rssUrls.push(data.status.url);
            watchedState.feeds.push(feed);
            watchedState.posts.push(...posts);
          })
          .catch((error) => {
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

      const checkNewPosts = (feeds, posts) => {
        const feedPromises = feeds.map((feed) => {
          const { url, id } = feed;
          const feedPosts = posts.filter((post) => post.feedId === id);
          return axios
            .get(allOriginProxyUrl, {
              params: {
                disableCache: true,
                url,
              },
            })
            .then((res) => {
              const { data } = res;
              const { items } = parseData(data.contents, 'text/xml');
              const newPosts = items
                .filter((item) => !feedPosts.find((post) => item.title === post.title))
                .map((post) => ({
                  ...post,
                  feedId: feed.id,
                  id: _.uniqueId(),
                }));
              return newPosts;
            });
        });
        Promise.all(feedPromises).then((newPosts) => {
          const postsToPush = newPosts.flat();
          if (postsToPush.length) {
            watchedState.posts.push(...postsToPush);
          }
          setTimeout(
            () => checkNewPosts(watchedState.feeds, watchedState.posts),
            5000,
          );
        });
      };
      checkNewPosts(watchedState.feeds, watchedState.posts);
    });
};
