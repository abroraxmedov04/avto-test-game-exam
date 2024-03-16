// dom elements
const welcomePageBtn = document.querySelector(".individual-game");
const welcomePage = document.querySelector(".welcome-page");
const inputPage = document.querySelector(".input-page");
const jsForm = document.querySelector(".js-form");
const gameDifficultySelector = document.querySelector(
  ".select-game-difficulty"
);
const mainPageGame = document.querySelector(".main-game-section");
const gameWrapper = document.querySelector(".game-cards");
const cardTemplate = document.querySelector(".game-card-template").content;
const gameCardTitle = document.querySelector(".game-title");
const gameDifficulty = document.querySelector(".game-difficulty");
const scoreCalculation = document.querySelector(".score-for-game");
const resultPage = document.querySelector(".result-page-winner");
const winnerScoreText = document.querySelector(".your-scrore");
const restartGameBtn = document.querySelector(".restart-game-btn");
const resultPageLose = document.querySelector(".result-page-loser");
const loseScoreText = document.querySelector(".your-scrore-lose");
const restartGameBtbnLose = document.querySelector(".restart-game-btn-lose");

const audioCorrect = document.getElementById("audioCorrect");
const audioWrong = document.getElementById("audioWrong");

let audioCoorect =
  // show and hide functionality of the page
  welcomePageBtn.addEventListener("click", () => {
    welcomePage.classList.add("hide");
    inputPage.classList.remove("hide");
  });

// global variables
let mainData = [];
let difficulty = "";
let resultArray = [];
let winnerScore = 0;
let countError = 0;

// event listener for the form from main form page to get value difficulty and render
jsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  difficulty = gameDifficultySelector.value;
  inputPage.style.display = "none";
  mainPageGame.style.display = "block";
  gameDifficulty.textContent = `game difficulty: ${difficulty}`;
  scoreCalculation.textContent = `score: ${winnerScore}`;
  resultArray = sliceArray(mainData);

  if (resultArray.length > 0) {
    renderCards(resultArray);
    displayRandomTitle();
  } else {
    mainPageGame.style.display = "none";
  }
});

// render card game function
function renderCards(arr) {
  arr.forEach((item) => {
    const cloneNode = cardTemplate.cloneNode(true);
    const cardImg = cloneNode.querySelector(".card-img");
    cardImg.src = item.symbol_img;
    cardImg.dataset.cardId = item.id;
    gameWrapper.appendChild(cloneNode);
  });
}

// get random and unique array with no repeated values
function getRandomData(arr) {
  for (let i = 0; i < arr.length; i++) {
    let randomIndex = Math.floor(Math.random() * arr.length);
    if (!mainData.includes(arr[randomIndex])) {
      mainData.push(arr[randomIndex]);
    } else {
      i--;
    }
  }
}

// slice array to get cloned array according to difficulty level
function sliceArray(arr) {
  // here is some chaining eith id=f condition
  if (difficulty === "easy") {
    return arr.slice(0, 10);
  } else if (difficulty === "medium") {
    return arr.slice(0, 20);
  } else if (difficulty === "hard") {
    return arr.slice(0, 30);
  }
}

// function to display title randomly to avoid displaying line by line data
function displayRandomTitle() {
  if (resultArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * resultArray.length);
    const randomTitle = resultArray[randomIndex].symbol_title;
    gameCardTitle.textContent = randomTitle;
    gameCardTitle.dataset.titleId = resultArray[randomIndex].id;
  } else {
    console.log("No more titles to display.");
    mainPageGame.style.display = "none";
  }
}

// main functionality with event target delegation
gameWrapper.addEventListener("click", (event) => {
  const clickedCard = event.target.closest(".game-card");

  if (!clickedCard) {
    return;
  }

  const cardImg = clickedCard.querySelector(".card-img");
  const cardId = cardImg.dataset.cardId;
  const index = mainData.findIndex((item) => item.id == cardId);

  if (index !== -1 && gameCardTitle.dataset.titleId === cardId) {
    const findIndex = resultArray.findIndex(
      (item) => item.symbol_title === gameCardTitle.textContent
    );

    if (findIndex !== -1) {
      resultArray.splice(findIndex, 1);
    }

    // handle function for Correctness
    handleCorrectCard(clickedCard);
  } else {
    // handle function for incorrectness
    handleIncorrectCard(clickedCard);
  }

  // Check if resultArray is empty
  if (resultArray.length == 0) {
    // end Game if the person win
    endGame();
  }
});

// function in order to work with correct answer
function handleCorrectCard(clickedCard) {
  clickedCard.style.background = "green";
  clickedCard.style.pointerEvents = "none";

  const correctGif = clickedCard.querySelector(".gif-correct");
  if (correctGif) {
    correctGif.classList.remove("hide");
  }

  winnerScore += 2;
  scoreCalculation.textContent = `score: ${winnerScore}`;

  audioCorrect.play();

  setTimeout(() => {
    clickedCard.style.opacity = "0";
  }, 2000); 

  if (resultArray.length > 0) {
    displayRandomTitle();
  } else {
    endGame();
  }
}

// function in order to work with incorrect answer
function handleIncorrectCard(clickedCard) {
  clickedCard.style.background = "red";
  const gifWrong = clickedCard.querySelector(".gif-wrong");

  if (gifWrong) {
    gifWrong.classList.remove("hide");
  }

  audioWrong.play();

  winnerScore -= 2;
  scoreCalculation.textContent = `score: ${winnerScore}`;
  loseScoreText.textContent = `your score: ${winnerScore}`;

  if (winnerScore <= -10) {
    endGame();
  }

  setTimeout(() => {
    clickedCard.style.background = "white";
    if (gifWrong) {
      gifWrong.classList.add("hide");
    }
  }, 2000);
}

// end game functionality if the person whether win or lose as expected
function endGame() {
  mainPageGame.style.display = "none";
  if (winnerScore <= -10) {
    resultPageLose.classList.remove("hide");
  } else {
    resultPage.classList.remove("hide");
    winnerScoreText.textContent = `your score: ${winnerScore}`;
  }
  restartGameBtn.addEventListener("click", () => {
    location.reload();
  });
  restartGameBtbnLose.addEventListener("click", () => {
    location.reload();
  });
}

// global function calls
getRandomData(roadSymbol);
sliceArray(mainData);
