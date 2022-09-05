import createDomElement from '../utils/createDomElement.js';

export default ({ postsContainer }, state) => {
  const card = createDomElement('div', ['card', 'border-0']);
  const cardBody = createDomElement('div', ['card-body']);
  cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';
  card.appendChild(cardBody);

  const ul = createDomElement('ul', ['list-group', 'border-0', 'rounded-0']);
  const postNodes = state.posts.map(({ title, link, id }) => {
    const li = createDomElement('li', [
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    ]);
    const className = state.viewedPosts[id] ? 'fw-normal' : 'fw-bold';
    const a = createDomElement('a', [className]);
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener norefferer');
    a.dataset.id = id;
    a.textContent = title;

    const button = createDomElement('button', [
      'btn',
      'btn-outline-primary',
      'btn-sm',
    ]);
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
