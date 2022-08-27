class RssParsingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RssParsingError';
  }
}

export default (parsedString, mimeType) => {
  const domParser = new DOMParser();
  const dataDocument = domParser.parseFromString(parsedString, mimeType);
  const rss = dataDocument.querySelector('rss');
  if (!rss) {
    throw new RssParsingError('notRssResource');
  }
  const title = dataDocument.querySelector('title').textContent;
  const description = dataDocument.querySelector('description').textContent;
  const link = dataDocument.querySelector('link').textContent;
  console.log(title);
  console.log(description);
  console.log(link);
  console.log(dataDocument);
  const items = dataDocument.querySelectorAll('item');
  console.log(items);
};
