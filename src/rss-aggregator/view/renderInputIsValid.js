export default ({ urlInput }, isValid) => {
  const { classList } = urlInput;
  if (isValid) {
    classList.remove('is-invalid');
    return;
  }
  classList.add('is-invalid');
};
