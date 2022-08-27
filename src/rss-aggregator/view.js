import onChange from 'on-change';

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

export default (state, elements) => {
  const { feedback, urlInput } = elements;
  return onChange(state, (path, value) => {
    if (path === 'form.feedback') {
      renderFeedback(feedback, value);
    }
    if (path === 'form.valid') {
      renderInputIsValid(urlInput, value);
    }
  });
};
