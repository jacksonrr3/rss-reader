
// const render = ()

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    fields: {
      urlInput: document.getElementById('url-input'),
    },
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      valid: true,
      prosessState: 'filling',
      processError: null,
      errors: {},
    },
    rss: [],
  };

  elements.form.addEventListener('submit', (event) => { 
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    if (isValudUrl(url)) { 
      
    }
  });

  // render(state, elements);
};
