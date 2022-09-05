import * as yup from 'yup';

yup.setLocale({
  mixed: {
    notOneOf: 'validateErrors.rssIsExist',
  },
  string: {
    url: 'validateErrors.invalidUrl',
  },
});

export default (rssLinks, url) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url()
      .notOneOf(rssLinks),
  });
  return schema.validate(url);
};
