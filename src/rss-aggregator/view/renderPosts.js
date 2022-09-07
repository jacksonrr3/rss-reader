export default ({ postsContainer }, state) => {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = '<h2 class="card-title h4">Посты</h2>';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.appendChild(cardBody);

  const postNodes = state.posts.map(({ title, link, id }) => {
    const a = document.createElement('a');
    a.classList.add(state.viewedPosts[id] ? 'fw-normal' : 'fw-bold');
    a.setAttribute('href', link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener norefferer');
    a.dataset.id = id;
    a.textContent = title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
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

    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    li.append(a, button);
    return li;
  });

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  ul.append(...postNodes);
  postsContainer.replaceChildren(card, ul);
};
