import { highlightText } from './highlighter.js';

(async function () {
  const article = document.querySelector('article');
  // console.log('article:', article);
  if (article) {
    const originalText = article.innerHTML;

    try {
      const highlightedText = await highlightText(originalText);
      // console.log('highlightedText:', highlightedText);
      article.innerHTML = highlightedText;
    } catch (error) {
      console.error('Error highlighting text:', error);
    }
  } else {
    console.warn('No article found on this page.');
  }
})();
