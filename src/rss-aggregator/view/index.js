import onChange from 'on-change';

import renderError from './renderError.js';
import renderFeedback from './renderFeedback.js';
import renderInput from './renderInput.js';
import renderFeeds from './renderFeeds.js';
import renderPosts from './renderPosts.js';
import renderModal from './renderModal.js';
import handelProcessState from './handelProcessState.js';

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.feedback':
        renderFeedback(elements, value);
        break;
      case 'form.processError':
        renderError(elements, value);
        break;
      case 'form.processState':
        handelProcessState(elements, value);
        break;
      case 'form.valid':
        renderInput(elements, { isValid: value });
        break;
      case 'feeds':
        renderFeeds(elements, value);
        break;
      case 'posts':
        renderPosts(elements, watchedState);
        break;
      case 'viewedPosts':
        renderPosts(elements, watchedState);
        break;
      case 'viewedPostId':
        // eslint-disable-next-line no-case-declarations
        const post = value && watchedState.posts.find(({ id }) => id === value);
        renderModal(elements, post);
        break;
      case 'rssUrls':
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        throw new Error(`Unknown state path: ${path}`);
    }
  });
  return watchedState;
};
