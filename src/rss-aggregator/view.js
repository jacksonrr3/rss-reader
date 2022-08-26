import onChange from 'on-change';

export const render = (state, elements) => {};

const renderFeedback = (el, texts) => {
  const fb = el;
  fb.innerText = texts.join(', ');
};

const renderInputIsValid = (el, isValid) => {
  const { classList } = el;
  if (isValid) {
    classList.remove('is-invalid');
    return;
  }
  classList.add('is-invalid');
};

export const getWatchedState = (state, elements) => {
  const { feedback, urlInput } = elements;
  return onChange(state, (path, value, previousValue, applyData) => {
    console.log(path);
    if (path === 'form.feedback') {
      renderFeedback(feedback, value);
    }
    if (path === 'form.valid') {
      renderInputIsValid(urlInput, value);
    }
  });
};