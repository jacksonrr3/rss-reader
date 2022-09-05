import onChange from 'on-change';

import { createEl } from './utils.js';

const renderFeedback = (elements, text) => {
  const { feedback } = elements;
  feedback.textContent = Array.isArray(text) ? text.join(', ') : text;
};

const renderError = (elements, error) => {
  const { feedback } = elements;
  if (error) {
    feedback.classList.add('text-danger');
  } else {
    feedback.classList.remove('text-danger');
  }
};

const renderInputIsValid = ({ urlInput }, isValid) => {
  const { classList } = urlInput;
  if (isValid) {
    classList.remove('is-invalid');
    return;
  }
  classList.add('is-invalid');
};

const renderFeeds = ({ feedsContainer }, feeds) => {
  const card = createEl('div', ['card', 'border-0']);
  const cardBody = createEl('div', ['card-body']);
  cardBody.innerHTML = '<h2 class="card-title h4">Фиды</h2>';
  card.appendChild(cardBody);

  const ul = createEl('ul', ['list-group', 'border-0', 'rounded-0']);
  const feedNodes = feeds.map(({ title, description }) => {
    const li = createEl('li', ['list-group-item', 'border-0', 'border-end-0']);
    li.innerHTML = `<h3 class='h6 m-0'>${title}</h3><p class='m-0 small text-black-50'>${description}</p>`;
    return li;
  });
  ul.append(...feedNodes);
  feedsContainer.replaceChildren(card, ul);
};

const renderPosts = ({ postsContainer }, state) => {
  const card = createEl('div', ['card', 'border-0']);
  const cardBody = createEl('div', ['card-body']);
  cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';
  card.appendChild(cardBody);

  const ul = createEl('ul', ['list-group', 'border-0', 'rounded-0']);
  const postNodes = state.posts.map(({ title, link, id }) => {
    const li = createEl('li', [
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    ]);
    const className = state.viewedPosts[id] ? 'fw-normal' : 'fw-bold';
    const a = createEl('a', [className]);
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener norefferer');
    a.dataset.id = id;
    a.textContent = title;

    const button = createEl('button', ['btn', 'btn-outline-primary', 'btn-sm']);
    button.setAttribute('type', 'button');
    button.dataset.id = id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = 'Просмотр';
    button.addEventListener('click', () => {
      // eslint-disable-next-line no-param-reassign
      state.viewedPostId = id;
      // eslint-disable-next-line no-param-reassign
      state.viewedPosts = { ...state.viewedPosts, [id]: true };
    });

    li.append(a, button);
    return li;
  });

  ul.append(...postNodes);
  postsContainer.replaceChildren(card, ul);
};

const renderModal = ({ modal }, post) => {
  if (post) {
    const { title, description, link } = post;
    const { modalTitle, modalDescription, modalLink } = modal;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalLink.setAttribute('href', link);
  }
};

const handelProsessState = () => {};

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.feedback':
        renderFeedback(elements, value);
        break;
      case 'form.processError':
        renderError(elements, value);
        break;
      case 'form.valid':
        renderInputIsValid(elements, value);
        break;
      case 'form.processState':
        handelProsessState();
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
