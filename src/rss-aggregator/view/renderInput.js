export default ({ urlInput }, options) => {
  const { classList } = urlInput;
  const { isValid } = options;
  if (isValid) {
    classList.remove('is-invalid');
    return;
  }
  classList.add('is-invalid');
};
