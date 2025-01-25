import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);

const replaceHtmlTagsWithPlaceholders = (text) => {
  const tags = [];
  let placeholderIndex = 0;

  const textWithPlaceholders = text.replace(/<\/?[^>]+(>|$)/g, (match) => {
    tags.push(match);
    return `(${placeholderIndex++})`;
  });

  return { textWithPlaceholders, tags };
};

const reapplyHtmlTags = (text, tags) => {
  const txt = text.replace(/<mark>\(\d+\)\(\d+\)/g, (match) => {
    const [start, end] = match.match(/\d+/g);
    return `(${start})(${end})<mark>`;
  });

  return txt.replace(/\(\d+\)/g, () => tags.shift());
};

export const highlightText = async (text, initialThreshold = 0.5, targetMinPercentage = 0.2, targetMaxPercentage = 0.4) => {
  const { textWithPlaceholders, tags } = replaceHtmlTagsWithPlaceholders(text);
  const doc = await nlp.readDoc(textWithPlaceholders);
  const sentenceWeights = await doc.out(nlp.its.sentenceWiseImportance);
  const totalSentences = sentenceWeights.length;

  if (totalSentences === 0) {
    console.warn("No sentences found in the text.");
    return text;
  }

  let threshold = initialThreshold;
  let filteredIndices = [];
  let epoch = 10;

  while (epoch--) {
    filteredIndices = sentenceWeights
      .filter(sentence => sentence.importance > threshold)
      .map(sentence => sentence.index)
      .filter(index => {
        const sentenceText = doc.sentences().itemAt(index).out(nlp.its.text);
        return sentenceText && sentenceText.trim().length > 0;
      });

    const percentage = filteredIndices.length / totalSentences;
    console.log(`Threshold: ${threshold}, Percentage: ${percentage * 100}%`);

    if (percentage >= targetMinPercentage && percentage <= targetMaxPercentage) {
      break;
    }

    if (percentage < targetMinPercentage) {
      threshold -= 0.05;
    } else if (percentage > targetMaxPercentage) {
      threshold += 0.05;
    }

    if (threshold < 0) {
      console.warn("Threshold adjustment reached the lower limit (0).");
      break;
    }
    if (threshold > 1) {
      console.warn("Threshold adjustment reached the upper limit (1).");
      break;
    }
  }

  filteredIndices.forEach(index => {
    doc.sentences().itemAt(Number(index)).markup();
  });

  const res = doc.out(nlp.its.markedUpText);
  return reapplyHtmlTags(res, tags);
};


const testHighlightText = async () => {
  const inputText = `
    This is a very important sentence. 
    This one is less important. 
    Highlighting key sentences is crucial for understanding. 
    Wink NLP makes this easier.
  `;

  console.log("Input Text:", inputText);

  try {
    const highlightedText = await highlightText(inputText, 0.6);
    console.log("Highlighted Text:", highlightedText);
  } catch (error) {
    console.error("Error in highlightText:", error);
  }
};

// Run the test function when this file is executed directly
// if (require.main === module) {
//   testHighlightText();
// }

// use import instead of require
// if (import.meta.url === import.meta.url) {
//   testHighlightText();
// }
