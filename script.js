import { WORDS } from "./word.js"

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
rightGuessString = "blink";
console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row);
    }

}



document.addEventListener("keyup", (e) => {
    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
});

// add letter
function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

// delete letter
function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1;
}

// check guess

function checkGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = ""
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in wordlist")
        return
    }

    var letterColor = ["#787C7F", "#787C7F", "#787C7F", "#787C7F", "#787C7F"];

    // check green
    for (let i = 0; i < 5; i++) {
        if (rightGuess[i] == currentGuess[i]) {
            letterColor[i] = "#6CA965";
            rightGuess[i] = "#";
        }
    }

    // check yellow
    // checking guess letters
    for (let i = 0; i < 5; i++) {
        if (letterColor[i] == "#6CA965") continue;

        //checking right letters
        for (let j = 0; j < 5; j++) {
            if (rightGuess[j] == currentGuess[i]) {
                letterColor[i] = "#C8B653";
                rightGuess[j] = "#";
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        let box = row.children[i];
        let delay = 250 * i
        setTimeout(() => {
            // flip box
            animateCSS(box, "flipInX")
            // shade box
            box.style.BackgroundColor = letterColor[i]
            shadeKeyBoard(guessString.charAt(i) + "", letterColor[i])
            shadeGameBoard(rightGuessString.charAt(i) + "", i)
        }, delay)
    }
    if (guessString === rightGuessString) {
        toastr.success("Congratz! You guessed the word right!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You have run out of guesses.")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}


function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === "#6CA965") {
                return
            }

            if (oldColor === "#C8B653" && color !== "#6CA965") {
                return
            }
            elem.style.backgroundColor = color
            break;
        }
    }
}

// function shadeGameBoard(letter, index) {
//     let n = -1;
//     for (const elem of document.getElementsByClassName("letter-box")) {
//         n++;

//         if (n > 4) {
//             n = n % 4;
//         }

//         let guess = elem.textContent;
//         if (!guess) {
//             continue;
//         }
//         console.log(`element at index ${n} is a '${guess}', comparing against '${letter}'`);
//         if (n !== index) {
//             continue;
//         }

//         console.log(`element at index ${n} is a '${guess}', comparing against '${letter}'`);
//         let oldColor = elem.style.backgroundColor;
//         if (oldColor === "#6CA965" || oldColor === "#C8B653" || oldColor === "#787C7F") {
//             continue;
//         }

//         if (guess === letter) {
//             elem.style.backgroundColor = "#6CA965";
//         }

//     }
// }

function shadeGameBoard(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
        return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
        return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
}


document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent;

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { "key": key }))
})

const animateCSS = (element, animation, prefix = "animate__") =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element
        node.style.setProperty("--animate-duration", "0.3s");

        node.classList.add(`${prefix}animated`, animationName)

        // when animation ends clean classes and resolve promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });

initBoard()