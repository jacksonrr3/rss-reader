export default (elements, error) => {
  const { feedback } = elements;
  if (error) {
    feedback.classList.add('text-danger');
  } else {
    feedback.classList.remove('text-danger');
  }
};
