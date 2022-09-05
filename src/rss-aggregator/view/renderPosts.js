import { createEl } from '../utils.js';

export default ({ postsContainer }, state) => {
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
