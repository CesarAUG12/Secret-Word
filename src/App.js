// css
import "./App.css";

//react
import { useCallback, useEffect, useState } from "react";

//dados
import { wordsList } from "./data/words";

//components
import StartScreen from "./Components/StartScreen";
import Game from "./Components/Game";
import GameOver from "./Components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(50);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);
    return { word, category };
  }, [words]);
  //starts game
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();
    // pick word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters

    let wordletters = word.split("");
    wordletters = wordletters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordletters);

    //fill states
    setPickedWord(word);
    setpickedCategory(category);
    setLetters(wordletters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //check if letter has already utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessesdLetters) => [
        ...actualGuessesdLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  
  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guesses  endend
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates()

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //check win condition
  useEffect(() =>{

    const uniqueLetters = [... new Set(letters)]
    
    if(guessedLetters.length === uniqueLetters.length){
      // add score
      setScore((actualScore) => actualScore += 100)

      //restart game with new word
      startGame();
    }

    console.log(uniqueLetters)

  }, [guessedLetters, letters, startGame])

  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name);
  };
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry}  score={score}/>}
    </div>
  );
}

export default App;
