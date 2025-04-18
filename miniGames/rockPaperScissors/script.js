const imgEls = document.querySelectorAll("img");
const resultEl = document.querySelector(".result");
const userChoiceEl = document.querySelector(".user-choice");
const computerChoiceEl = document.querySelector(".computer-choice");
const userPointsEl = document.querySelector(".user-points");
const computerPointsEl = document.querySelector(".computer-points");

const choicesMap = {
    rock: "камінь",
    paper: "папір",
    scissor: "ножиці"
};

let userPoints= 0;
let computerPoints = 0;

imgEls.forEach((img) => {
    img.addEventListener("click", () => {
        const computerTurn = computerChoice();
        const result = gamePlay(img.id, computerTurn);
        userChoiceEl.textContent = choicesMap[img.id];
        computerChoiceEl.textContent = choicesMap[computerTurn];
        resultEl.textContent = result;
    });
});

// Computer randomly pick one choice from the given choices
function computerChoice() {
  const choices = ["rock", "paper", "scissor"];
  const randomChoice = Math.floor(Math.random() * choices.length);
  return choices[randomChoice];
}

function reward(type='win') { 
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Invalid score')
        return
    }
    let score;
    if (type === 'win') {
        score = 10
    } else if (type === 'lose') {
        score = -5
    }
    fetch('/checkAuth', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (!data.isAuthenticated) {
                return
            }
            fetch(`/miniGames/reward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score, user: data.user }),
            })
            .catch(error => {
                console.error(error)
            })
        })
}

// it return result by checking user and computer selection
function gamePlay(userSelection, computerSelection) {
    const userChoiceUkrainian = choicesMap[userSelection];
    const computerChoiceUkrainian = choicesMap[computerSelection];

    if (userSelection === computerSelection) {
        return "Нічия...";
    } else if (
        (userSelection === "rock" && computerSelection === "scissor") ||
        (userSelection === "paper" && computerSelection === "rock") ||
        (userSelection === "scissor" && computerSelection === "paper")
    ) {
        userPoints++;
        userPointsEl.textContent = userPoints;
        reward();
        return `Ви виграли! ${userChoiceUkrainian} перемагає ${computerChoiceUkrainian}`;
    } else {
        computerPoints++;
        computerPointsEl.textContent = computerPoints;
        reward('lose')
        return `Ви програли! ${computerChoiceUkrainian} перемагає ${userChoiceUkrainian}`;
    }
}