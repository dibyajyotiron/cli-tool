const { defineWord, getAntonyms, getDetails, getExamples, getSynonyms, guessMatcher, fetchRandomWord } = require("../controllers/commandController");
module.exports = program => {
  program.version("0.0.1").description("Dictionary");
  // 1. Define a word
  program
    .command("defn <word>")
    .alias("d")
    .description("Defines the given word!")
    .action(word => defineWord("defn", word));

  // 2. Synonyms of a word
  program
    .command("syn <word>")
    .alias("s")
    .description("Get synonyms of a given word!")
    .action(async word => getSynonyms("syn", word));

  // 3. Word Antonyms
  program
    .command("ant <word>")
    .alias("a")
    .description("Get antonyms of a given word!")
    .action(async word => getAntonyms("ant", word));
  // 4. Word Examples
  program
    .command("ex <word>")
    .alias("e")
    .description("Get examples of given word!")
    .action(async word => getExamples("ex", word));
  // 5. Word Full Dict
  program
    .command("full <word>")
    .alias("f")
    .description("Get full dictionary!")
    .action(word => getDetails(word));
  // 6. Word of the day
  program
    .command("wod")
    .alias("w")
    .description("Get word of the day!")
    .action(() => fetchRandomWord(true).then(e => console.log(e)));
  // 7. Word Game
  program
    .command("play")
    .alias("p")
    .description("Guess the word!")
    .action(async () => guessMatcher());

  program.parse(process.argv);
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};
