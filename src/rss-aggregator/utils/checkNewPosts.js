import { uniqueId } from 'lodash';

import getDataFromProxy from './getDataFromProxy';
import parseData from './parser.js';

export const checkNewPosts = (feeds, posts) => {
  const feedPromises = feeds.map((feed) => {
    const { url, id } = feed;
    const currentFeedPosts = posts.filter((post) => post.feedId === id);
    return getDataFromProxy(url).then(({ data }) => {
      const { items } = parseData(data.contents, 'text/xml');
      const newPosts = items
        .filter(
          (item) => !currentFeedPosts.find((post) => item.title === post.title),
        )
        .map((post) => ({
          ...post,
          feedId: feed.id,
          id: uniqueId(),
        }));
      return newPosts;
    });
  });

  Promise.all(feedPromises).then((newPosts) => {
    const postsToPush = newPosts.flat();
    if (postsToPush.length) {
      posts.push(...postsToPush);
    }
    setTimeout(() => checkNewPosts(feeds, posts), 5000);
  });
};

export default { checkNewPosts };
