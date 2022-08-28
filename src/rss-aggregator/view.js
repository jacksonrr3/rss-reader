import { create } from 'lodash';
import onChange from 'on-change';

import { createEl } from './utils.js';

const renderFeedback = (el, texts) => {
  const fb = el;
  fb.innerText = Array.isArray(texts) ? texts.join(', ') : texts;
};

const renderInputIsValid = (el, isValid) => {
  const { classList } = el;
  if (isValid) {
    classList.remove('is-invalid');
    return;
  }
  classList.add('is-invalid');
};

const renderFeeds = (container, feeds) => {
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
  container.replaceChildren(card, ul);
};

const renderPosts = (contsiner, posts) => {};

const handelProsessState = (elements, prosessState) => {};

export default (state, elements) => {
  const { feedback, urlInput } = elements;
  return onChange(state, (path, value) => {
    if (path === 'form.feedback') {
      renderFeedback(feedback, value);
    }
    if (path === 'form.valid') {
      renderInputIsValid(urlInput, value);
    }
    if (path === 'feeds') {
      renderFeeds(elements.feeds, value);
    }
    if (path === 'posts') {
      renderPosts(elements.posts, value);
    }
    if (path === 'form.prosessState') {
      handelProsessState(elements, value);
    }
  });
};
