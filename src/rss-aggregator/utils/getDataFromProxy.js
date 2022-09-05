import axios from 'axios';

const corsProxy = 'https://allorigins.hexlet.app/get';

export default (url) => axios.get(corsProxy, {
  params: {
    disableCache: true,
    url,
  },
});
