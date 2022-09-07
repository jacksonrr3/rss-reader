export default ({ feedsContainer }, feeds) => {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = '<h2 class="card-title h4">Фиды</h2>';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  card.appendChild(cardBody);

  const feedNodes = feeds.map(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class='h6 m-0'>${title}</h3><p class='m-0 small text-black-50'>${description}</p>`;
    return li;
  });

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  ul.append(...feedNodes);
  feedsContainer.replaceChildren(card, ul);
};
