import i18next from 'i18next';
import { uniqueId } from 'lodash';

import ru from './locales/ru.js';

import validate from './utils/validate.js';
import getDataFromProxy from './utils/getDataFromProxy.js';
import parseData from './utils/parser.js';
import getFeedId from './utils/getFeedId.js';
import { checkNewPosts } from './utils/checkNewPosts.js';
import getWatchedState from './view/index.js';
import errorHandler from './errorHandler.js';

export default async (lng) => {
  await i18next
    .createInstance()
    .init({
      lng,
      resources: {
        ru,
      },
    })
    .then((t) => {
      const elements = {
        form: document.querySelector('.rss-form'),
        urlInput: document.getElementById('url-input'),
        feedback: document.querySelector('.feedback'),
        feedsContainer: document.querySelector('.feeds'),
        postsContainer: document.querySelector('.posts'),
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

      elements.urlInput.addEventListener('input', () => {
        if (watchedState.form.processState !== 'filling') {
          watchedState.form.processState = 'filling';
        }
      });

      elements.form.addEventListener('submit', async (event) => {
        event.preventDefault();
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
            feed.id = getFeedId();
            feed.url = url;
            const posts = items.map((item) => ({
              ...item,
              id: uniqueId(),
              feedId: feed.id,
            }));

            watchedState.form.processError = null;
            watchedState.form.processState = 'sent';
            watchedState.form.feedback = t('rssSuccessLoaded');
            watchedState.rssUrls.push(url);
            watchedState.feeds.push(feed);
            watchedState.posts.push(...posts);
            checkNewPosts(watchedState.feeds, watchedState.posts);
          })
          .catch(errorHandler(watchedState, t));
      });
    });
};
