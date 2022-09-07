export default (state, translator) => (error) => {
  const { form } = state;
  form.processError = true;
  switch (error.name) {
    case 'ValidationError':
      form.feedback = error.errors.map((err) => translator(err));
      form.valid = false;
      break;
    case 'AxiosError':
      form.feedback = translator('networkError');
      form.processError = error.message;
      form.processState = 'error';
      break;
    case 'RssParsingError':
      form.feedback = translator(error.message);
      break;
    default:
      form.feedback = translator(error.message);
  }
};
