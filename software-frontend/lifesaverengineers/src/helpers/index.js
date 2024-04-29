export {default as validators} from './validators'

const toUpperCaseFirstWord = (text) => {
  const newText = text.charAt(0).toUpperCase() + text.split(" ")[0].slice(1);

  return newText;
};

export default toUpperCaseFirstWord;
