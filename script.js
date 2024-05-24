const size = 4;
const board = document.getElementById("sudoku-table");
const colorOptions = document.getElementById("color-options");
const submitButton = document.getElementById("submit-button");

function createMenuContent() {
  const menuContent = document.createElement("div");
  menuContent.classList.add("menu-content");

  for (let i = 1; i <= 3; i++) {
    const button = document.createElement("button");
    button.textContent = `Button ${i}`;
    button.classList.add("menu-content");
    menuContent.appendChild(button);
  }

  const list = document.createElement("ul");
  menuContent.appendChild(list);

  for (let i = 1; i <= 2; i++) {
    const listItem = document.createElement("li");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `checkbox${i}`;
    input.classList.add("menu-checkbox");

    const label = document.createElement("label");
    label.setAttribute("for", `checkbox${i}`);
    label.textContent = `Checkbox ${i}`;
    label.classList.add("menu-content");

    listItem.appendChild(input);
    listItem.appendChild(label);
    list.appendChild(listItem);
  }
  

  return menuContent;
}

function addColorButtons() {
  for (let i = 1; i <= size; i++) {
    const colorButton = document.createElement("button");
    colorButton.style.backgroundColor = getNumberColor(i);
    colorButton.dataset.value = i;
    colorButton.style.position = "relative";

    // Function to handle button press
    const handleButtonPress = (event) => {
      colorButton.style.boxShadow = "0px 0px 0px #000";
      colorButton.style.transform = "translateY(8px)";
    };

    // Function to handle button release
    const handleButtonRelease = (event) => {
      colorButton.style.boxShadow = "";
      colorButton.style.transform = "";
    };

    // Event listener for the color buttons
    colorButton.addEventListener("click", (event) => {
      colorOptions.childNodes.forEach((child) => {
        child.classList.remove("selected");
        child.style.border = "";
        child.classList.remove("color-button-selected");
      });
      event.target.classList.add("selected");
      event.target.classList.add("color-button-selected");

      // Change the color of the selected cell
      const selectedCellIndex = Array.from(board.getElementsByTagName("td")).findIndex((cell) => cell.classList.contains("selected-cell"));
      if (selectedCellIndex !== -1) {
        const selectedCell = board.getElementsByTagName("td")[selectedCellIndex];
        const selectedColorValue = Number(event.target.dataset.value);
        selectedCell.style.backgroundColor = getNumberColor(selectedColorValue);
        selectedCell.dataset.value = selectedColorValue;

        // Deselect the cell
        selectedCell.classList.remove("selected-cell");

        // Deselect the color button
        event.target.classList.remove("selected");
        event.target.style.border = "";
        event.target.classList.remove("color-button-selected");

        // Check if all cells are filled and validate the solution
        if (checkFilledCells()) {
          checkSolution();
        }
      }
    });

    // Add touch event listeners for mobile devices
    colorButton.addEventListener("touchstart", handleButtonPress);
    colorButton.addEventListener("touchend", handleButtonRelease);

    // Add mouse event listeners for desktop devices
    colorButton.addEventListener("mousedown", handleButtonPress);
    colorButton.addEventListener("mouseup", handleButtonRelease);
    colorButton.addEventListener("mouseleave", handleButtonRelease);

    colorOptions.appendChild(colorButton);
  }
}

function resetGame() {
  document.getElementById("alert-modal").style.display = "none"; // Add this line to close the alert
  elapsedTime = 0;
  startTimer();
  createGrid();
}

function showAlert(emoji, title, message, newGameButton = false, otherButtons = false, customContent, closeButtonText = "Close") {
  const alertModal = document.getElementById("alert-modal");
  const alertEmoji = document.getElementById("emoji-alert");
  const alertTitle = document.getElementById("alert-title");
  const alertMessage = document.getElementById("alert-message");
  const alertClose = document.getElementById("alert-close");
  const alertNewGame = document.getElementById("alert-new-game");
  alertNewGame.addEventListener("click", resetGame);
  const alertOther1 = document.getElementById("alert-other-1");
  const alertOther2 = document.getElementById("alert-other-2");

  alertEmoji.textContent = emoji;
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  alertModal.style.display = "block";

  // Show or hide the Close, New Game, and Other buttons based on the passed parameters
  alertClose.style.display = newGameButton ? "none" : "inline-block";
  alertClose.textContent = closeButtonText;
  alertNewGame.style.display = newGameButton ? "inline-block" : "none";
  alertOther1.style.display = otherButtons ? "inline-block" : "none";
  alertOther2.style.display = otherButtons ? "inline-block" : "none";

  const alertCustomContent = document.getElementById("alert-custom-content");
  if (customContent) {
    alertCustomContent.innerHTML = "";
    alertCustomContent.appendChild(customContent);
    alertCustomContent.style.display = "block";
  } else {
    alertCustomContent.style.display = "none";
  }

  alertClose.onclick = function() {
    alertModal.style.display = "none";
    startTimer();
  };

  window.onclick = function(event) {
    if (event.target === alertModal) {
      alertModal.style.display = "none";
    }
  };
}

function otherAction1() {
  // Placeholder function for Other 1 button
  console.log("Other 1 button clicked");
}

function otherAction2() {
  // Placeholder function for Other 2 button
  console.log("Other 2 button clicked");
}

const alertOther1 = document.getElementById("alert-other-1");
const alertOther2 = document.getElementById("alert-other-2");

alertOther1.addEventListener("click", otherAction1);
alertOther2.addEventListener("click", otherAction2);

function checkSolution() {
  const userPuzzle = getUserPuzzle(board);
  if (isPuzzleSolved(userPuzzle)) {
    pauseTimer();
    const minutes = Math.floor(elapsedTime / 1000 / 60);
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    showAlert(
      "🏆",
      "Congratulations!",
      `You solved the puzzle in ${formattedMinutes}:${formattedSeconds}!`,
      true, // Show the new game button
      // true // Show the other buttons
    );
    submitButton.textContent = "New Game";
    submitButton.removeEventListener("click", checkSolution);
    submitButton.addEventListener("click", resetGame);
  } else {
    pauseTimer();
    showAlert(
      "🤔",
      "Almost There",
      "At least one cell in this puzzle needs to be corrected.",
      false,
      false
    );
  }
}

function createGrid() {
  board.innerHTML = "";
  const puzzle = generatePuzzle();

  // Create the 4x4 grid
  for (let row = 0; row < size; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < size; col++) {
      const td = document.createElement("td");
      td.classList.add("cell"); // Add class "cell" to the td elements

      if (puzzle[row][col] !== 0) {
        const color = getNumberColor(puzzle[row][col]);
        td.style.backgroundColor = color;
        td.dataset.value = puzzle[row][col];
        td.style.fontWeight = "bold";

        // Add a black dot in the center
        const dot = document.createElement("div");
        dot.style.width = "16px";
        dot.style.height = "16px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "#333333";
        dot.style.position = "absolute";
        dot.style.top = "50%";
        dot.style.left = "50%";
        dot.style.transform = "translate(-50%, -50%)";
        td.style.position = "relative";
        td.appendChild(dot);
      } else {
        td.style.backgroundColor = "#FAF8F6";
        // Cell click event listener
        td.addEventListener("click", () => {
          const selectedColorButton = document.querySelector(".color-button-selected");

          // If the cell is already selected, reset it
          if (td.classList.contains("selected-cell")) {
            td.style.backgroundColor = "#FAF8F6";
            td.dataset.value = 0;
            td.classList.remove("selected-cell");
            return;
          }

          if (selectedColorButton) {
            // If a color button is already selected, change the cell color immediately
            const selectedColorValue = Number(selectedColorButton.dataset.value);
            td.style.backgroundColor = getNumberColor(selectedColorValue);
            td.dataset.value = selectedColorValue;

            // Deselect the color button
            selectedColorButton.classList.remove("color-button-selected");
            selectedColorButton.style.border = "";

            // Deselect the cell
            const selectedCell = document.querySelector(".selected-cell");
            if (selectedCell) {
              selectedCell.classList.remove("selected-cell");
            }

            // Check if all cells are filled and validate the solution
            if (checkFilledCells()) {
              checkSolution();
            }
          } else {
            // If no color button is selected, mark the cell as selected
            const selectedCell = document.querySelector(".selected-cell");
            if (selectedCell) {
              selectedCell.classList.remove("selected-cell");
            }
            td.classList.add("selected-cell");
          }
        });

        td.addEventListener("touchstart", () => {
          td.classList.add("cell-active");
        });

        td.addEventListener("touchend", () => {
          td.classList.remove("cell-active");
        });

        td.addEventListener("touchcancel", () => {
          td.classList.remove("cell-active");
        });

      }

      tr.appendChild(td);
    }
    board.appendChild(tr);
  }
}

function checkFilledCells() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board.rows[row].cells[col];
      if (!cell.dataset.value) {
        return false;
      }
    }
  }
  return true;
}

function addCheckboxListeners() {
  document.getElementById("checkbox1").addEventListener("change", function() {
    // Your custom code for checkbox1 goes here
    console.log("Checkbox 1 toggled:", this.checked);
  });

  document.getElementById("checkbox2").addEventListener("change", function() {
    // Your custom code for checkbox2 goes here
    console.log("Checkbox 2 toggled:", this.checked);
  });
}

document.addEventListener("DOMContentLoaded", () => {

  const puzzle = generatePuzzle();

  addColorButtons();

  // Create the 4x4 grid
  createGrid();

  startTimer();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  document.querySelector(".menu-button").addEventListener("click", () => {
    const menuButtons = document.getElementById("menu-buttons").cloneNode(true);
    menuButtons.style.display = "block";
    pauseTimer();
    showAlert("⚙️", "Menu", "© 2024 Matt Fanelli", false, false, menuButtons, "Resume");
    // addCheckboxListeners();
  });


});

function validateInput(dropdown) {
  const value = parseInt(dropdown.value);

  if (value < 1 || value > 4) {
    dropdown.value = "";
  }
}

function generatePuzzle() {
  let puzzle = new Array(size).fill(null).map(() => new Array(size).fill(0));
  fillValues(puzzle);
  removeValues(puzzle);
  return puzzle;
}

function fillValues(puzzle) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (puzzle[row][col] === 0) {
        const options = [1, 2, 3, 4];
        shuffleArray(options);

        for (let i = 0; i < options.length; i++) {
          if (isValid(puzzle, row, col, options[i])) {
            puzzle[row][col] = options[i];
            if (fillValues(puzzle)) {
              return true;
            }
            puzzle[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeValues(puzzle) {
  const minClues = 4;
  const maxClues = 6;
  const numClues = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;

  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      cells.push([row, col]);
    }
  }

  shuffle(cells);

  let count = size * size;
  for (const [row, col] of cells) {
    if (count <= numClues) {
      break;
    }

    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    const tempGrid = JSON.parse(JSON.stringify(puzzle));
    const numSolutions = countSolutions(tempGrid);

    if (numSolutions === 1) {
      count--;
    } else {
      puzzle[row][col] = temp;
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function countSolutions(puzzle, row = 0, col = 0) {
  if (row === size) {
    return 1;
  }

  if (puzzle[row][col] !== 0) {
    return countSolutions(
      puzzle,
      col === size - 1 ? row + 1 : row,
      col === size - 1 ? 0 : col + 1
    );
  }

  let numSolutions = 0;

  for (let num = 1; num <= size; num++) {
    if (isValid(puzzle, row, col, num)) {
      puzzle[row][col] = num;
      numSolutions += countSolutions(
        puzzle,
        col === size - 1 ? row + 1 : row,
        col === size - 1 ? 0 : col + 1
      );
      puzzle[row][col] = 0;

      if (numSolutions > 1) {
        break;
      }
    }
  }

  return numSolutions;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isValid(puzzle, row, col, num) {
  return (
    !isInRow(puzzle, row, num) &&
    !isInCol(puzzle, col, num) &&
    !isInBox(puzzle, row - (row % 2), col - (col % 2), num)
  );
}

function isInRow(puzzle, row, num) {
  return puzzle[row].includes(num);
}

function isInCol(puzzle, col, num) {
  return puzzle.some(row => row[col] === num);
}

function isInBox(puzzle, rowStart, colStart, num) {
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      if (puzzle[rowStart + row][colStart + col] === num) {
        return true;
      }
    }
  }
  return false;
}

function isPuzzleSolved(userPuzzle) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const userCellValue = userPuzzle[row][col];
      if (
        !isUniqueInRow(userPuzzle, row, userCellValue) ||
        !isUniqueInCol(userPuzzle, col, userCellValue) ||
        !isUniqueInBox(userPuzzle, row - (row % 2), col - (col % 2), userCellValue)
      ) {
        return false;
      }
    }
  }
  return true;
}

function getUserPuzzle(board) {
  const userPuzzle = [];
  for (let row = 0; row < size; row++) {
    const userPuzzleRow = [];
    for (let col = 0; col < size; col++) {
      const cell = board.rows[row].cells[col];
      const cellValue = cell.dataset.value || 0;
      userPuzzleRow.push(parseInt(cellValue, 10));
    }
    userPuzzle.push(userPuzzleRow);
  }
  return userPuzzle;
}


function isUniqueInRowColBox(puzzle, row, col, num) {
  return (
    isUniqueInRow(puzzle, row, num) &&
    isUniqueInCol(puzzle, col, num) &&
    isUniqueInBox(puzzle, row - (row % 2), col - (col % 2), num)
  );
}

function isUniqueInRow(puzzle, row, num) {
  return puzzle[row].indexOf(num) === puzzle[row].lastIndexOf(num);
}

function isUniqueInCol(puzzle, col, num) {
  let count = 0;
  for (let row = 0; row < size; row++) {
    if (puzzle[row][col] === num) {
      count++;
    }
  }
  return count === 1;
}

function isUniqueInBox(puzzle, rowStart, colStart, num) {
  let count = 0;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      if (puzzle[rowStart + row][colStart + col] === num) {
        count++;
      }
    }
  }
  return count === 1;
}

let timer;
let startTime;
let elapsedTime = 0;

function pauseTimer() {
  clearInterval(timer);
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timer = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 1000 / 60);
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    document.getElementById("timer").textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function getNumberColor(num) {
  switch (num) {
    case 1:
      return "#FECE00";
    case 2:
      return "#FFB3DA";
    case 3:
      return "#F2994A";
    case 4:
      return "#2F80ED";
    default:
      return "#000000";
  }
}


function getColorNumber(color) {
  switch (color) {
    case "#FECE00":
      return 1;
    case "#FFB3DA":
      return 2;
    case "#F2994A":
      return 3;
    case "#2F80ED":
      return 4;
    default:
      return 0;
  }
}

function getColorNumber(color) {
  const colorsMap = {
    "#FECE00": 1,
    "#FFB3DA": 2,
    "#F2994A": 3,
    "#2F80ED": 4,
  };

  return colorsMap[color];
}