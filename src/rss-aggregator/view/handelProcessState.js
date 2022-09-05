export default (elements, processState) => {
  const { urlInput, form } = elements;
  switch (processState) {
    case 'filling':
      break;
    case 'sent':
      urlInput.disabled = false;
      urlInput.value = '';
      form.focus();
      break;
    case 'sending':
      urlInput.disabled = true;
      break;
    // eslint-disable-next-line no-fallthrough
    default:
      throw new Error(`Unknown processState value: ${processState}`);
  }
};
