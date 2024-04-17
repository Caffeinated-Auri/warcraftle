import { WORDS } from "./word.js";

document.addEventListener("DOMContentLoaded", () => {
    createSquares()

    let guessedWords = [[]];
    let availableSpace = 1;
    let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;
    let winStreak = localStorage.getItem("winStreak") || 0;

    const wordOption = WORDS[WORDS.length * Math.random() << 0];
    const word = wordOption.word;
    const hint = wordOption.hint;
    const gamesPlayedDisplay = document.getElementById("games-played");
    const winStreakDisplay = document.getElementById("win-streak");

    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1]
    }
    // initialise game stats and update display
    gamesPlayedDisplay.textContent = gamesPlayed;
    winStreakDisplay.textContent = winStreak;

    // store games played
    localStorage.setItem("gamesPlayed", Number(gamesPlayed) + 1);

    function updateGuessedWords(letter) {
        const currentWordArr = getCurrentWordArr()

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter)

            const availableSpaceEl = document.getElementById(String(availableSpace))
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }
    document.addEventListener("keydown", (event) => {
        const keyPressed = event.key.toLowerCase();

        if (/^[a-z]$/.test(keyPressed)) {
            updateGuessedWords(keyPressed);
        } else if (keyPressed === "enter") {
            handleSubmitWord();
        } else if (keyPressed === "backspace") {
            event.preventDefault(); // Prevent default behavior of backspace key
            handleDeleteLetter();
        }

    });

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter)
        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }
        const letterInThatPosition = word.charAt(index)
        const isCorrectPosition = letter === letterInThatPosition

        if (isCorrectPosition) {
            return "rgb(83, 141, 78)"
        }
        return "rgb(181, 159, 59)"
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            toastr.error("Word must be 5 letters")
            return
        }
        const currentWord = currentWordArr.join("")

        // the map method creates an array using only the words from the WORDS object and iterates over each element to extract the "word" property from each object
        if (!WORDS.map(w => w.word).includes(currentWord)) {
            toastr.error("This word is not in the word list")
            return
        }

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index)

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId)
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};{border-color:${tileColor}}`
                const keyboardEl = document.querySelector(`[data-key=${letter}]`);
                keyboardEl.style = `background-color:${tileColor};`

            }, interval * index)
        })

        guessedWordCount += 1;

        if (currentWord === word) {
            toastr.success("Congrats you got it right!")
            winStreak++;
            localStorage.setItem("winStreak", winStreak);
            gamesPlayedDisplay.textContent = gamesPlayed;
            winStreakDisplay.textContent = winStreak;
        }

        if (guessedWords.length === 6) {
            toastr.error(`You have no more guesses. The word is ${word}`)
            localStorage.setItem("winStreak", 0)
        }
        guessedWords.push([])
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        // check if current row is not empty and user pressed enter
        if (currentWordArr.length > 0 && availableSpace > (guessedWordCount * 5)) {
            const removedLetter = currentWordArr.pop();

            guessedWords[guessedWords.length - 1] = currentWordArr;

            const lastLetterEl = document.getElementById(String(availableSpace - 1));

            lastLetterEl.textContent = "";
            availableSpace = availableSpace -= 1;
        }
    }
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord()
                return;
            }
            if (letter === "del") {
                handleDeleteLetter();
                return;
            }
            updateGuessedWords(letter)
        }
    }
    function displayHint() {
        toastr.info(`${hint}`)
    }

    window.displayHint = displayHint;
});


function displayStats() {
    const text = document.getElementById("statField");
    text.style.display = "block";
};

window.displayStats = displayStats;

function closeStats() {
    const close = document.getElementById("statField");
    close.style.display = "none";
}

window.closeStats = closeStats;