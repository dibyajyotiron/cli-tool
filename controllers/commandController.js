#!/usr/bin/env node

const { getResults, pickRandom, parseRelationship, showHints } = require("../lib/helpers");

const { prompt } = require("inquirer");

const options = [
  {
    type: "list",
    name: "choices",
    message: "Select an Option",
    choices: ["Retry", "Hint", "Quit"]
  }
];

const input = [
  {
    type: "input",
    name: "guessed",
    message: "Guess the word!"
  }
];

// Define a word
function defineWord(command, word) {
  return getResults(command, word)
    .then(re => console.log(re))
    .catch(e => console.log(e));
}

// Get Synonyms
function getSynonyms(command, word) {
  return getResults(command, word)
    .then(re => console.log(re.filter(r => r.relationshipType === "synonym")))
    .catch(e => console.log(e));
}

// Get Antonyms
function getAntonyms(command, word) {
  return getResults(command, word)
    .then(re => console.log(Array.isArray(re) && re.length > 1 ? re.filter(r => r.relationshipType === "antonym") : { message: "No antonyms found!" }))
    .catch(e => console.log(e));
}

// 4. Word Examples
function getExamples(command, word) {
  return getResults(command, word)
    .then(re => console.log(re.examples))
    .catch(e => console.log(e));
}

//5. Word Full Dict
function getDetails(word) {
  const defn = getResults("defn", word);
  const synAnt = getResults("syn", word);
  const ex = getResults("ex", word);
  return Promise.all([defn, synAnt, ex])
    .then(re => console.log(re))
    .catch(e => console.log(e));
}

function quit({ word, definition, synonyms, antonyms }) {
  console.log("The word is ", word);
  console.log({ definition, synonyms, antonyms });
  console.log("Bye!");
  return;
}

//7. Word Game
function tryAgain(input, resultObj) {
  const correctWord = resultObj.word;
  prompt(input)
    .then(an => {
      if (an.guessed === correctWord) {
        console.log("You win!");
        return;
      }
      // tryAgain(input, correctWord);
      quit(resultObj);
    })
    .catch(ex => console.log(ex));
}

//6. Word of the Day
async function fetchRandomWord(detailed = false) {
  const res = await getResults("random");
  const details = await Promise.all([getResults("defn", res.word), getResults("syn", res.word), getResults("ex", res.word)]);
  // const details = await Promise.all([getResults("defn", "single"), getResults("syn", "single"), getResults("ex", "single")]); // testing data
  let synonyms = parseRelationship(details, "synonym");
  let antonyms = parseRelationship(details, "antonym");
  const pickADefn = detailed ? details[0].map(a => a.text) : pickRandom(details[0]).text;
  synonyms = detailed ? synonyms : pickRandom(synonyms);
  antonyms = detailed ? antonyms : pickRandom(antonyms);
  // console.log(res);

  const resultObj = { definition: pickADefn, synonyms, word: res.word };
  // const resultObj = { definition: pickADefn, synonyms, word: "single" }; // testing data

  if ((Array.isArray(antonyms) && antonyms.length > 1) || antonyms) {
    resultObj["antonyms"] = antonyms;
  }

  return resultObj;
}

async function guessMatcher() {
  const resultObj = await fetchRandomWord(true);
  const { definition, synonyms, antonyms, word } = resultObj;

  if (antonyms.length) {
    console.log(pickRandom([{ definition: pickRandom(definition) }, { synonyms: pickRandom(synonyms) }, { antonyms: pickRandom(antonyms) }]));
  } else console.log(pickRandom([{ definition: pickRandom(definition) }, { synonyms: pickRandom(synonyms) }]));

  prompt(input).then(an => {
    if (an.guessed === word) {
      console.log("Guessed it correct!");
      return;
    }
    if (synonyms.includes(an.guessed)) {
      console.log("You guessed a synonym! Good job!");
      console.log("The word is ", word);
      return;
    }
    console.log("Wrong Answer!");
    prompt(options).then(res => {
      switch (res.choices) {
        case "Retry":
          tryAgain(input, resultObj);
          break;
        case "Hint":
          console.log(showHints(resultObj));
          tryAgain(input, resultObj);
          break;
        case "Quit":
          quit(resultObj);
          return;
      }
    });
  });
}

module.exports = {
  defineWord,
  getSynonyms,
  getAntonyms,
  getExamples,
  getDetails,
  guessMatcher,
  parseRelationship,
  fetchRandomWord
};
