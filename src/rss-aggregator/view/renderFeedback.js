export default (elements, text) => {
  const { feedback } = elements;
  feedback.textContent = Array.isArray(text) ? text.join(', ') : text;
};
