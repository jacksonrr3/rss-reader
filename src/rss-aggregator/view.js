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

const renderPosts = (container, posts) => {
  const card = createEl('div', ['card', 'border-0']);
  const cardBody = createEl('div', ['card-body']);
  cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';
  card.appendChild(cardBody);

  const ul = createEl('ul', ['list-group', 'border-0', 'rounded-0']);
  const postNodes = posts.map(({
    title,
    description,
    link,
    id,
  }) => {
    const li = createEl('li', [
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    ]);
    const a = createEl('a', ['fw-bold']);
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
    button.addEventListener('click', () => {});

    li.append(a, button);
    return li;
  });

  ul.append(...postNodes);
  container.replaceChildren(card, ul);
};

const handelProsessState = () => {};

export default (state, elements) => {
  const { feedback, urlInput } = elements;
  return onChange(state, (path, value) => {
    if (path === 'form.feedback') {
      renderFeedback(feedback, value);
    }
    if (path === 'form.valid') {
      renderInputIsValid(urlInput, value);
    }
    if (path === 'form.prosessState') {
      handelProsessState(elements, value);
    }
    if (path === 'feeds') {
      renderFeeds(elements.feeds, value);
    }
    if (path === 'posts') {
      renderPosts(elements.posts, value);
    }
  });
};
