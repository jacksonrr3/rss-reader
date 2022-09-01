import i18next from 'i18next';
import { uniqueId } from 'lodash';

import en from './locales/en.js';

import validate from './validate.js';
import { getDataFromProxy } from './utils.js';
import getWatchedState from './view.js';
import parseData from './parser.js';

let feedId = 0;
let currentTimerId = null;

export default (lng) => {
  i18next
    .createInstance()
    .init({
      lng,
      resources: {
        en,
      },
    })
    .then((t) => {
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

      const watchedState = getWatchedState(state, elements);

      const checkNewPosts = (feeds, posts) => {
        const feedPromises = feeds.map((feed) => {
          const { url, id } = feed;
          const feedPosts = posts.filter((post) => post.feedId === id);
          return getDataFromProxy(url).then((res) => {
            const { data } = res;
            const { items } = parseData(data.contents, 'text/xml');
            const newPosts = items
              .filter(
                (item) => !feedPosts.find((post) => item.title === post.title),
              )
              .map((post) => ({
                ...post,
                feedId: feed.id,
                id: uniqueId(),
              }));
            return newPosts;
          });
        });

        Promise.all(feedPromises).then((newPosts) => {
          const postsToPush = newPosts.flat();
          if (postsToPush.length) {
            watchedState.posts.push(...postsToPush);
          }
          currentTimerId = setTimeout(
            () => checkNewPosts(watchedState.feeds, watchedState.posts),
            5000,
          );
        });
      };

      elements.urlInput.addEventListener('input', () => {
        watchedState.form.processState = 'filling';
      });

      elements.form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearTimeout(currentTimerId);
        const formData = new FormData(event.target);
        const url = formData.get('url');
        validate(watchedState.rssUrls, { url })
          .then(({ url: validUrl }) => {
            watchedState.form.feedback = [''];
            watchedState.form.valid = true;
            watchedState.form.processState = 'sending';
            return getDataFromProxy(validUrl);
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
            elements.urlInput.value = '';
            elements.form.focus();

            watchedState.form.processError = null;
            watchedState.form.processState = 'sent';
            watchedState.form.feedback = t('rssSuccessLoaded');
            watchedState.rssUrls.push(data.status.url);
            watchedState.feeds.push(feed);
            watchedState.posts.push(...posts);
          })
          .catch((error) => {
            const { name } = error;
            watchedState.form.processError = true;
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

        checkNewPosts(watchedState.feeds, watchedState.posts);
      });
    });
};
