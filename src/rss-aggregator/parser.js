class RssParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RssParsingError';
  }
}

const extractValuesFromDoc = (doc, props) => {
  const resultObject = props.reduce(
    (acc, prop) => ({ ...acc, [prop]: doc.querySelector(prop).textContent }),
    {},
  );
  return resultObject;
};

export default (parsedString, mimeType) => {
  const domParser = new DOMParser();
  const dataDomDocument = domParser.parseFromString(parsedString, mimeType);
  const rss = dataDomDocument.querySelector('rss');
  if (!rss) {
    throw new RssParsingError('notRssResource');
  }
  const feed = extractValuesFromDoc(dataDomDocument, [
    'title',
    'description',
    'link',
  ]);
  const items = Array.from(dataDomDocument.querySelectorAll('item')).map(
    (item) => extractValuesFromDoc(item, ['title', 'description', 'link']),
  );
  return { feed, items };
};
