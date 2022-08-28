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
  const dataDocument = domParser.parseFromString(parsedString, mimeType);
  const rss = dataDocument.querySelector('rss');
  if (!rss) {
    throw new RssParsingError('notRssResource');
  }
  // console.log(dataDocument);
  const feed = extractValuesFromDoc(dataDocument, [
    'title',
    'description',
    'link',
  ]);
  const items = Array.from(dataDocument.querySelectorAll('item')).map(
    (item) => extractValuesFromDoc(item, ['title', 'description', 'link']),
  );
  // console.log(items);
  return { feed, items };
};
