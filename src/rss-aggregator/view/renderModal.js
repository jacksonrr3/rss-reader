export default ({ modal }, post) => {
  if (post) {
    const { title, description, link } = post;
    const { modalTitle, modalDescription, modalLink } = modal;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalLink.setAttribute('href', link);
  }
};
