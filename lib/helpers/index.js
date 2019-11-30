const axios = require("axios");
const { baseURL } = require("../../config/keys");
const { fourtyTwoWordsAPIKEY: api_key } = process.env;

const isObject = n => Object.prototype.toString.call(n) === "[object Object]";

const getRoute = function(type, word) {
  const routes = {
    defn: `${baseURL}/word/${word}/definitions?api_key=${api_key}`,
    ex: `${baseURL}/word/${word}/examples?api_key=${api_key}`,
    syn: `${baseURL}/word/${word}/relatedWords?api_key=${api_key}`,
    ant: `${baseURL}/word/${word}/relatedWords?api_key=${api_key}`,
    random: `${baseURL}/words/randomWord?api_key=${api_key}`
  };
  return routes[type];
};

const getResults = async function(type, word) {
  try {
    const uri = getRoute(type, word);
    const result = await axios.get(uri);
    return result.data;
  } catch (err) {
    console.log("Something went wrong!");
    throw new Error(err);
  }
};

const pickRandom = function(array = []) {
  // array = array.filter(a => (isObject(a) && Object.keys(a)) || a);
  return array[~~(Math.random() * array.length)];
};

String.prototype.randomize = function() {
  var a = this.split(""),
    n = a.length;

  for (var i = n - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
};
const showHints = wordDetails => {
  let randomized = wordDetails.word.randomize();
  let synonym = pickRandom(wordDetails.synonyms);
  let antonym = wordDetails.antonyms && pickRandom(wordDetails.antonyms);

  // tryAgain(input, res);
  return pickRandom([antonym || synonym, randomized]);
};
const parseRelationship = (wordsList, relation) => {
  return wordsList[1]
    .filter(d => d.relationshipType === relation)
    .map(d => d.words)
    .flat();
};

module.exports = {
  getResults,
  pickRandom,
  showHints,
  parseRelationship
};
