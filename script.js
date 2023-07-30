import { WORDS } from "./word.js";

const Total_GUESSES = 6;
let Remaining_guesses = Total_GUESSES;
let curr_Guess = [];
let nextLetter = 0;
let Word_TO_GUESS = WORDS[Math.floor(Math.random() * WORDS.length)]
// console.log(Word_TO_GUESS)

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < Total_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

document.addEventListener("keyup", (e) => {

    if (Remaining_guesses === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

function insertLetter(pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - Remaining_guesses]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    curr_Guess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - Remaining_guesses]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    curr_Guess.pop()
    nextLetter -= 1
}

function checkGuess() {

    let row = document.getElementsByClassName("letter-row")[6 - Remaining_guesses]
    let guessString = ''
    let rightGuess = Array.from(Word_TO_GUESS)

    for (const val of curr_Guess) {
        guessString += val
    }

    if (guessString.length != 5) {
        showMessage("Not enough letters!");
        return;
      }

    if (!WORDS.includes(guessString)) {
        showMessage("Not in Word List!")
        const gameBoard = document.getElementById("game-board");
        gameBoard.classList.add("shake");
        setTimeout(() => {
            gameBoard.classList.remove("shake");
        }, 500);
        return;
    }



    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = curr_Guess[i]

        let letterPosition = rightGuess.indexOf(curr_Guess[i])
        if (letterPosition === -1) {
            letterColor = '#787c7e' //non matching cells
        } else {
            if (curr_Guess[i] === rightGuess[i]) {
                letterColor = '#6aaa64'
            } else {
                letterColor = '#c9b458'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor
            box.style.color = "white"
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === Word_TO_GUESS) {
        showMessage("You guessed right!<br>Well Played!");
        Remaining_guesses = 0;
        return;
      } else {
        Remaining_guesses -= 1;
        curr_Guess = [];
        nextLetter = 0;
    
        if (Remaining_guesses === 0) {
        //   showMessage("");
        showMessage(`You've run out of guesses! Game over!<br>The right word was: "${Word_TO_GUESS}"`);
        }
      }
}

function showMessage(message) {
    const messageBar = document.getElementById("message-bar");
    // messageBar.textContent = message;
    messageBar.innerHTML = message;
    messageBar.style.display = "block";
  
    setTimeout(() => {
      messageBar.style.display = "none";
    }, 3000);
  }

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });