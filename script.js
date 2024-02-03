const mountainCoordinates = [
    { row: 2, column: 2 },
    { row: 4, column: 9 },
    { row: 6, column: 4 },
    { row: 9, column: 10 },
    { row: 10, column: 6 },
];

const elements = [
    {
        time: 2,
        type: "water",
        shape: [[1, 1, 1]],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "town",
        shape: [[1, 1, 1]],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 1,
        type: "forest",
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "farm",
        shape: [
            [1, 1, 1],
            [0, 0, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "forest",
        shape: [
            [1, 1, 1],
            [0, 0, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "town",
        shape: [
            [1, 1, 1],
            [0, 1, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "farm",
        shape: [
            [1, 1, 1],
            [0, 1, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 1,
        type: "town",
        shape: [
            [1, 1],
            [1, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 1,
        type: "town",
        shape: [
            [1, 1, 1],
            [1, 1, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 1,
        type: "farm",
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 1,
        type: "farm",
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "water",
        shape: [
            [1, 1, 1],
            [1, 0, 0],
            [1, 0, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "water",
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [1, 0, 0],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "forest",
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "forest",
        shape: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
    {
        time: 2,
        type: "water",
        shape: [
            [1, 1],
            [1, 1],
        ],
        rotation: 0,
        mirrored: false,
    },
];

const missions = {
    basic: [
        {
            title: "Edge of the forest",
            description:
                "You get one point for each forest field adjacent to the edge of your map.",
        },
        {
            title: "Sleepy valley",
            description:
                "For every row with three forest fields, you get four points.",
        },
        {
            title: "Watering potatoes",
            description:
                "You get two points for each water field adjacent to your farm fields.",
        },
        {
            title: "Borderlands",
            description: "For each full row or column, you get six points.",
        },
    ],
    extra: [
        {
            title: "Tree line",
            description:
                "You get two points for each of the fields in the longest vertically uninterrupted continuous forest. If there are two or more tree lines with the same longest length, only one counts.",
        },
        {
            title: "Watering canal",
            description:
                "For each column of your map that has the same number of farm and water fields, you will receive four points. You must have at least one field of both terrain types in your column to score points.",
        },
        {
            title: "Wealthy town",
            description:
                "You get three points for each of your village fields adjacent to at least three different terrain types.",
        },
        {
            title: "Magicians valley",
            description:
                "You get three points for your water fields adjacent to your mountain fields.",
        },
        {
            title: "Empty site",
            description:
                "You get two points for empty fields adjacent to your village fields.",
        },
        {
            title: "Row of houses",
            description:
                "For each field in the longest village fields that are horizontally uninterrupted and contiguous you will get two points.",
        },
        {
            title: "Odd numbered silos",
            description:
                "For each of your odd numbered full columns you get 10 points.",
        },
        {
            title: "Rich countryside",
            description:
                "For each row with at least five different terrain types, you will receive four points.",
        },
    ],
};

const gridSize = 11;
let timeUnitsRemaining = 28;
let gridArray = [];
let previewYesCells = []; // Array to store coordinates of "preview-yes" cells
let missionA = null;
let missionB = null;
let missionC = null;
let missionD = null;
let missionATotalScore = 0;
let missionBTotalScore = 0;
let missionCTotalScore = 0;
let missionDTotalScore = 0;
let totalScore = 0;
let isGameOver = false;
let nextElement = getRandomShape();
let currentElement = displayRandomShape();
let currentElementShape = currentElement.shape;

// Initializing the game when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    initGame();
    highlightMissions('missionA', 'missionB');
});

// Initializing game settings and grid
function initGame() {

    // Select the container where the grid map will be placed
    const mapContainer = document.querySelector(".grid-map");

    // Initialize the time units
    timeUnitsRemaining = 28;

    // Reset and create the grid map
    mapContainer.innerHTML = ""; // Clear previous map
    createMap(mountainCoordinates, mapContainer);

    // Display the first element
    currentElement = displayRandomShape();
    currentElementShape = currentElement.shape;

    // Get random missions and update mission iamges
    missionA = getRandomMission();
    missionB = getRandomMission();
    missionC = getRandomMission();
    missionD = getRandomMission();

    // Update mission images in the HTML
    if (missionA !== null && missionB !== null && missionC !== null && missionD !== null) {
        document.getElementById("missionA").querySelector("img").src = `assets/missions/${convertToImageFilename(missionA.title)}.png`;
        document.getElementById("missionB").querySelector("img").src = `assets/missions/${convertToImageFilename(missionB.title)}.png`;
        document.getElementById("missionC").querySelector("img").src = `assets/missions/${convertToImageFilename(missionC.title)}.png`;
        document.getElementById("missionD").querySelector("img").src = `assets/missions/${convertToImageFilename(missionD.title)}.png`;

    } else {
        console.log('mission is null');
    }

    // Set up event listeners for game interaction, such as placing elements
    setUpEventListeners();
}

// Convert mission title to a filename format
function convertToImageFilename(title) {
    // Replace spaces with underscores and convert to lower case for the filename
    return title.replace(/\s+/g, '_').toLowerCase();
}

// Setting up your event listeners for user interactions
function setUpEventListeners() {
    // Attach event listener for mouseover to preview element placement
    document.querySelector(".grid-map").addEventListener("mouseover", (event) => {
        let targetCell = event.target;
        let hoverPosition = getCoordinatesFromGridCell(targetCell);
        if (hoverPosition !== null) {
            previewElementOnGrid(currentElementShape, hoverPosition);
        }
    });

    document.querySelector(".grid-map").addEventListener("click", (event) => {
        let targetCell = event.target;
        let hoverPosition = getCoordinatesFromGridCell(targetCell);

        // If the clicked are is not a cell but a background of the map
        if (hoverPosition === null) return;
        const clickedPreviewYes = previewYesCells.find(
            (cell) => cell.x === hoverPosition.x && cell.y === hoverPosition.y
        );

        if (isShapeWithOtherOnes(currentElementShape) || clickedPreviewYes) {
            // Check if the placement will be within the map boundaries
            if (
                hoverPosition.x + currentElementShape[0].length <= gridSize &&
                hoverPosition.y + currentElementShape.length <= gridSize
            ) {
                placeShape(currentElementShape, hoverPosition);
            }
        }

    });

    document.querySelector("#rotate-button").addEventListener("click", () => {
        currentElementShape = rotateShape(currentElementShape);
        displayShape(currentElementShape, currentElement.type);
    });

    document.querySelector("#flip-button").addEventListener("click", () => {
        currentElementShape = flipShape(currentElementShape);
        displayShape(currentElementShape, currentElement.type);
    });
}

// Creating the grid map with mountains
function createMap(mountainCoordinates, mapContainer) {
    for (let row = 1; row <= 11; row++) {
        let rowArray = [];
        for (let column = 1; column <= 11; column++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.setAttribute("data-x", column);
            cell.setAttribute("data-y", row);

            const isMountain = mountainCoordinates.some(
                (coord) => coord.row === row && coord.column === column
            );
            if (isMountain) {
                cell.classList.add("grid-mountain");
                rowArray.push(1);
            } else {
                rowArray.push(0);
            }

            mapContainer.appendChild(cell);
        }
        gridArray.push(rowArray);
    }
}

// Getting coordinates from a grid cell element
function getCoordinatesFromGridCell(targetCell) {
    if (targetCell.classList.contains("grid-cell")) {
        const x = parseInt(targetCell.getAttribute("data-x"), 10) - 1;
        const y = parseInt(targetCell.getAttribute("data-y"), 10) - 1;
        return { x, y };
    }
    return null; // Return null if it's not a grid cell
}

// Selecting a random element from the elements array
function getRandomShape() {
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
}

// Displaying a given element shape and type
function displayShape(shape, type) {
    const elementGrid = document.querySelector(".element-grid");

    // Determine the size of the element's shape
    const height = shape.length;
    const width = shape[0].length;

    // Calculate the grid template columns and rows based on shape size
    elementGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    elementGrid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Clear the previous element grid
    elementGrid.innerHTML = "";

    // Display the element
    shape.forEach((row) => {
        row.forEach((cell) => {
            const elementCell = document.createElement("div");
            elementCell.classList.add("element-cell");

            // If the cell is part of the shape, add the specific class for its type
            if (cell === 1) {
                elementCell.classList.add(type);
            } else {
                elementCell.classList.add("empty-cell");
            }

            elementGrid.appendChild(elementCell);
        });
    });

    // You can add additional logic here to handle any other attributes or information related to the element

    return {
        shape: shape,
        type: type,
    };
}

// Previewing an element on the grid based on mouse hover position
function displayRandomShape() {
    // Select a random element from the elements array
    const elementGrid = document.querySelector(".element-grid");
    const randomElement = nextElement;

    // Determine the size of the current element's shape
    const height = randomElement.shape.length;
    const width = randomElement.shape[0].length;

    // Calculate the grid template columns and rows based on shape size
    elementGrid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    elementGrid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Clear the previous element grid
    elementGrid.innerHTML = "";

    // Display the new element
    randomElement.shape.forEach((row) => {
        row.forEach((cell) => {
            const elementCell = document.createElement("div");
            elementCell.classList.add("element-cell");

            // If the cell is part of the shape, add the specific class for its type
            if (cell === 1) {
                elementCell.classList.add(randomElement.type);
            } else {
                elementCell.classList.add("empty-cell");
            }

            elementGrid.appendChild(elementCell);
        });
    });

    // Update the time unit display
    const timeUnitDisplay = document.querySelector("#timeUnit");
    timeUnitDisplay.textContent = randomElement.time;

    return randomElement;
}

// Placing an element on the grid
function previewElementOnGrid(elementShape, hoverPosition) {
    // Clear previous preview classes and reset the array
    document.querySelectorAll(".preview-yes, .preview-no").forEach((cell) => {
        cell.classList.remove("preview-yes", "preview-no");
    });
    previewYesCells = [];

    const gridSize = gridArray.length;
    const height = elementShape.length;
    const width = elementShape[0].length;

    // Calculate the maximum allowable position for the top-left corner of the shape
    const maxStartX = gridSize - width;
    const maxStartY = gridSize - height;

    // Ensure that the hover position is within the bounds
    hoverPosition.x = Math.min(hoverPosition.x, maxStartX);
    hoverPosition.y = Math.min(hoverPosition.y, maxStartY);

    let collision = false;

    // Check if any part of the shape fits within the visible grid area
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (elementShape[i][j]) {
                let x = hoverPosition.x + j;
                let y = hoverPosition.y + i;

                if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
                    collision = true;
                    continue;
                }

                if (gridArray[y][x] !== 0) {
                    collision = true;
                } else {
                    // Store the coordinates of "preview-yes" cells
                    previewYesCells.push({ x, y });
                }
            }
        }
    }

    // Apply 'preview-no' class to the entire shape if there is any collision
    if (collision) {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (elementShape[i][j]) {
                    let x = hoverPosition.x + j;
                    let y = hoverPosition.y + i;

                    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                        let cell = document.querySelector(
                            `.grid-cell[data-x='${x + 1}'][data-y='${y + 1}']`
                        );
                        if (cell) {
                            cell.classList.add("preview-no");
                        }
                    }
                }
            }
        }
    } else {
        // Apply 'preview-yes' class to the entire shape if there is no collision
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (elementShape[i][j]) {
                    let x = hoverPosition.x + j;
                    let y = hoverPosition.y + i;

                    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
                        let cell = document.querySelector(
                            `.grid-cell[data-x='${x + 1}'][data-y='${y + 1}']`
                        );
                        if (cell) {
                            cell.classList.add("preview-yes");
                        }
                    }
                }
            }
        }
    }
}

// Checking if an element can be placed on the grid
function placeShape(elementShape, clickPosition) {
    let collision = false;
    const oneCoordinates = [];

    //  Check if the game is over, if so, prevent further actions
    if (isGameOver) {
        console.log("Game is over, no further  placements allowed.");
        return;
    }

    // Check if any part of the shape will go out of bounds or overlap with a non-empty cell
    for (let i = 0; i < elementShape.length; i++) {
        for (let j = 0; j < elementShape[i].length; j++) {
            let x = clickPosition.x + j;
            let y = clickPosition.y + i;

            // Check if the current part of the shape is within bounds
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
                continue; // Skip the current iteration and move to the next one
            }

            // Check if the current part of the shape is overlapping with a non-empty cell
            if (elementShape[i][j] && gridArray[y][x] !== 0) {
                collision = true;
                break; // Break out of the loop early since we found an invalid position
            }

            // If the current part of the shape is a 1, record its coordinates
            if (elementShape[i][j]) {
                oneCoordinates.push({ x, y });
            }
        }
        if (collision) break; // Break out of the outer loop if a collision was found
    }

    // If there is no collision, place the element on the grid
    if (!collision) {
        // Now you have the coordinates of the 1s in oneCoordinates
        for (const coord of oneCoordinates) {
            gridArray[coord.y][coord.x] = currentElement.type; // Set the cell to the current element's type
        }

        timeUnitsRemaining -= currentElement.time;

        updateGrid();
        nextElement = getRandomShape();

        let currentTime = 28 - timeUnitsRemaining
        let currentSeasonTime = currentTime % 7;

        if ((currentSeasonTime === 1 && currentElement.time === 2) || currentSeasonTime === 0) {
            calculateAndDisplayMissionScores(currentTime - 1);
        }

        currentElement = displayRandomShape();
        currentElementShape = currentElement.shape;

        // Call this function to check if the game should end
        if (!canPlaceShape(currentElementShape, gridArray)) {
            // End the game
            alert("Game Over: No legal placements left\n Your total score is: " + totalScore);
            console.log("Game Over: No legal placements left");
            isGameOver = true;
            return;
        }

        const elapsedTimeDisplay = document.querySelector("#elapsedTime");
        elapsedTimeDisplay.textContent = currentSeasonTime;

        // Check if the game is over after placing the element
        if (timeUnitsRemaining <= 0) {
            endGame();
            return; // Exit the function if the game is over
        }
    }
}

// Checking if a specific element placement is legal
function isPlacementLegal(shape, startX, startY, grid) {
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                let posX = startX + x;
                let posY = startY + y;

                if (posX < 0 || posX >= gridSize || posY < 0 || posY >= gridSize || grid[posY][posX] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Checking for any legal placements left for the current element
function canPlaceShape(shape, grid) {
    // Check current shape and its three rotations
    for (let i = 0; i < 4; i++) { // Four rotations
        if (checkPlacement(shape, grid)) return true;
        shape = rotateShape(shape);
    }
    return false;
}

// Checking if an element can be placed on the grid
function checkPlacement(shape, grid) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (isPlacementLegal(shape, x, y, grid)) {
                return true;
            }
        }
    }
    return false;
}

// Updating the visual representation of the grid
function updateGrid() {
    const gridCells = document.querySelectorAll(".grid-cell");

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = gridCells[i * gridSize + j];
            const cellX = j;
            const cellY = i;

            // Check if the cell corresponds to a tile (not a mountain)
            if (!cell.classList.contains("grid-mountain")) {
                // Get the type of the tile from gridArray
                const tileType = gridArray[cellY][cellX];

                // Update the cell's class to reflect the new tile type
                cell.className = "grid-cell";

                // Apply the appropriate class based on the tileType
                switch (tileType) {
                    case "forest":
                        cell.classList.add("element-cell", "forest");
                        break;
                    case "water":
                        cell.classList.add("element-cell", "water");
                        break;
                    case "town":
                        cell.classList.add("element-cell", "town");
                        break;
                    case "farm":
                        cell.classList.add("element-cell", "farm");
                        break;
                    default:
                        cell.classList.add("empty-cell");
                }
            }
        }
    }
}

// Checking if the current shape has any cells with a value of 1
function isShapeWithOtherOnes(shape) {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] === 1) {
                return true;
            }
        }
    }
    return false;
}

// Ending the game and handle final actions
function endGame() {
    isGameOver = true;
    alert("Game Over! Your total score is: " + totalScore);
}

// Getting a random mission from the available missions
function getRandomMission() {
    const combinedMissions = [...missions['basic'], ...missions['extra']];

    if (combinedMissions.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * combinedMissions.length);
    const randomMission = combinedMissions[randomIndex];

    if (missions['basic'].includes(randomMission)) {
        missions['basic'].splice(missions['basic'].indexOf(randomMission), 1);
    } else if (missions['extra'].includes(randomMission)) {
        missions['extra'].splice(missions['extra'].indexOf(randomMission), 1);
    }

    return randomMission;
}

// Rotating an element shape
function rotateShape(shape) {
    let rotated = [];

    for (let j = 0; j < shape[0].length; j++) {
        let newRow = shape.map(row => row[j]).reverse();
        rotated.push(newRow);
    }
    return rotated;
}

// Flipping an element shape
function flipShape(shape) {
    const flippedShape = [];

    for (let i = 0; i < shape.length; i++) {
        flippedShape.push(shape[i].slice().reverse());
    }

    return flippedShape;
}

// Calculating and displaying mission scores based on elapsed time units
function calculateAndDisplayMissionScores(timeUnitsElapsed) {

    let season = getCurrentSeason(timeUnitsElapsed);

    // Calculate mission scores based on the current season
    let missionScoreA = calculateMissionsScores(missionA);
    let missionScoreB = calculateMissionsScores(missionB);
    let missionScoreC = calculateMissionsScores(missionC);
    let missionScoreD = calculateMissionsScores(missionD);

    let seasonScore = 0;
    let seasonScoreElement;
    let pointsElement;

    // Determine the current season based on timeUnitsElapsed
    switch (season) {
        case "Spring": {
            seasonScore = missionScoreA + missionScoreB + surroundedMountain();
            missionATotalScore += missionScoreA;
            missionBTotalScore += missionScoreB;
            // missionATotalScore = Math.max(missionScoreA, missionATotalScore);
            // missionBTotalScore = Math.max(missionScoreB, missionBTotalScore);
            document.getElementById('currentSeason').innerText = "Summer (BC)";
            document.querySelector('#missionA').querySelector('#missionScore').textContent = missionATotalScore;
            document.querySelector('#missionB').querySelector('#missionScore').textContent = missionBTotalScore;
            highlightMissions('missionB', 'missionC');
            break;
        }
        case "Summer": {
            seasonScore = missionScoreB + missionScoreC + surroundedMountain();
            missionBTotalScore += missionScoreB;
            missionCTotalScore += missionScoreC;
            // missionBTotalScore = Math.max(missionScoreB, missionBTotalScore);
            // missionCTotalScore = Math.max(missionScoreC, missionCTotalScore);
            document.getElementById('currentSeason').innerText = "Autumn (CD)";
            document.querySelector('#missionB').querySelector('#missionScore').textContent = missionBTotalScore;
            document.querySelector('#missionC').querySelector('#missionScore').textContent = missionCTotalScore;
            highlightMissions('missionC', 'missionD');
            break;
        }
        case "Autumn": {
            seasonScore = missionScoreC + missionScoreD + surroundedMountain();
            missionCTotalScore += missionScoreC;
            missionDTotalScore += missionScoreD;
            // missionCTotalScore = Math.max(missionScoreC, missionCTotalScore);
            // missionDTotalScore = Math.max(missionScoreD, missionDTotalScore);
            document.getElementById('currentSeason').innerText = 'Winter AD';
            document.querySelector('#missionC').querySelector('#missionScore').textContent = missionCTotalScore;
            document.querySelector('#missionD').querySelector('#missionScore').textContent = missionDTotalScore;
            highlightMissions('missionA', 'missionD');
            break;
        }
        case "Winter": {
            seasonScore = missionScoreA + missionScoreD + surroundedMountain();
            missionATotalScore += missionScoreA;
            missionDTotalScore += missionScoreD;
            // missionATotalScore = Math.max(missionScoreA, missionATotalScore);
            // missionDTotalScore = Math.max(missionScoreD, missionDTotalScore);
            // document.getElementById('currentSeason').innerText = 'Sprint';
            document.querySelector('#missionA').querySelector('#missionScore').textContent = missionATotalScore;
            document.querySelector('#missionD').querySelector('#missionScore').textContent = missionDTotalScore;
            break;
        }
    }

    // Update the HTML element to display the mission score for the current season
    seasonScoreElement = document.getElementById(`${season.toLowerCase()}`);
    pointsElement = seasonScoreElement.querySelector(".points");
    pointsElement.textContent = seasonScore;

    // console.log(`Points for ${season}: ${seasonScore}, ${missionScoreA}
    // ${missionScoreB} ${missionScoreC} ${missionScoreD}`);

    // Update the total score
    totalScore += seasonScore;
    document.getElementById("totalPoints").textContent = totalScore;
}

// Calculating scores for different missions
function calculateMissionsScores(mission) {
    switch (mission.title) {
        // Basic missions
        case "Borderlands": return calculateBorderlandsScore();
        case "Edge of the forest": return calculateEdgeOfTheForestScore();
        case "Sleepy valley": return calculateSleepyValleyScore();
        case "Watering potatoes": return calculateWateringPotatoes();

        // Extra missions
        case "Tree line": return calculateTreeLineScore();
        case "Watering canal": return calculateWateringCanalScore();
        case "Wealthy town": return calculateWealthyTownScore();
        case "Magicians valley": return calculateMagiciansValleyScore();
        case "Empty site": return calculateEmptySiteScore();
        case "Row of houses": return calculateTerracedHouseScore();
        case "Odd numbered silos": return calculateOddNumberedSilosScore();
        case "Rich countryside": return calculateRichCountrysideScore();
        default: return 0; // Return 0 if the mission is not recognized
    }
}

// Extra point calculation for covering a mountain
function surroundedMountain() {
    let surroundedMountainsCount = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const mountain of mountainCoordinates) {
        let terrainsCount = 0;
        for (const [dx, dy] of directions) {
            let ni = mountain.row - 1 + dx;
            let nj = mountain.column - 1 + dy;

            if (gridArray[ni][nj] !== 0) {
                terrainsCount++;
            }
        }
        if (terrainsCount === 4) surroundedMountainsCount++;
    }

    return surroundedMountainsCount;
}

// Basic Missions
// Borderlands
function calculateBorderlandsScore() {
    let score = 0;

    // Check completed rows
    for (let row = 0; row < gridSize; row++) {
        if (isRowCompleted(row)) {
            score += 6;
        }
    }

    // Check completed columns
    for (let col = 0; col < gridSize; col++) {
        if (isColumnCompleted(col)) {
            score += 6;
        }
    }

    return score;
}

function isRowCompleted(row) {
    for (let col = 0; col < gridSize; col++) {
        if (gridArray[row][col] === 0) {
            return false;
        }
    }
    return true;
}

function isColumnCompleted(col) {
    for (let row = 0; row < gridSize; row++) {
        if (gridArray[row][col] === 0) {
            return false;
        }
    }
    return true;
}

// Edge of the forest
function calculateEdgeOfTheForestScore() {
    let missionScore = 0;
    const gridSize = gridArray.length;

    // Check top and bottom edges
    for (let x = 0; x < gridSize; x++) {
        if (gridArray[0][x] === "forest") {
            missionScore++;
        }
        if (gridArray[gridSize - 1][x] === "forest") {
            missionScore++;
        }
    }

    // Check left and right edges, excluding corners
    for (let y = 1; y < gridSize - 1; y++) {
        if (gridArray[y][0] === "forest") {
            missionScore++;
        }
        if (gridArray[y][gridSize - 1] === "forest") {
            missionScore++;
        }
    }

    return missionScore;
}

// Sleepy valley
function calculateSleepyValleyScore() {
    let missionScore = 0;

    for (let i = 0; i < gridSize; i++) {
        let countOfForests = 0;
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === "forest") {
                countOfForests++;
            }
        }
        if (countOfForests === 3) {
            missionScore += 4;
        }
    }

    return missionScore;
}

// Watering potatoes
function calculateWateringPotatoes() {
    let missionScore = 0;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let iPlus1 = i + 1 < gridSize && gridArray[i + 1][j] === "farm";
            let iMinus1 = i - 1 >= 0 && gridArray[i - 1][j] === "farm";
            let jPlus1 = j + 1 < gridSize && gridArray[i][j + 1] === "farm";
            let jMinus1 = j - 1 >= 0 && gridArray[i][j - 1] === "farm";

            if (gridArray[i][j] === "water") {
                if (i === 0 && j === 0 && (iPlus1 || jPlus1)) {
                    missionScore += 2;
                } else if (i === 0 && (iPlus1 || jPlus1 || jMinus1)) {
                    missionScore += 2;
                } else if (j === 0 && (iPlus1 || jPlus1 || iMinus1)) {
                    missionScore += 2;
                } else if (iPlus1 || iMinus1 || jPlus1 || jMinus1) {
                    missionScore += 2;
                }
            }
        }
    }

    return missionScore;
}

// Extra Missions
// Tree line
function calculateTreeLineScore() {
    let max_line = 0;
    for (let i = 0; i < gridSize; i++) {
        let current_line = 0;
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[j][i] == "forest") {
                current_line++;
                if (current_line > max_line) {
                    max_line = current_line;
                }
            } else {
                current_line = 0;
            }
        }
    }

    return max_line * 2;
}

// Watering canal
function calculateWateringCanalScore() {
    let count = 0;
    for (let i = 0; i < gridSize; i++) {
        let farmCount = 0;
        let waterCount = 0;
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[j][i] == "water") {
                waterCount++;
            } else
                if (gridArray[j][i] == "farm") {
                    farmCount++;
                }
        }
        if (waterCount == farmCount && waterCount > 0) {
            count += 4;
        }
    }

    return count;
}

// Wealthy town
function calculateWealthyTownScore() {
    let missionScore = 0;

    // Function to check if there are at least 3 different terrain types around the town
    const checkNeighbors = (i, j) => {
        let terrainTypes = new Set();

        // Define directions for up, down, left, right
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        // Check only the four orthogonal neighbors
        for (const [dx, dy] of directions) {
            let ni = i + dx, nj = j + dy;
            if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize && gridArray[ni][nj] !== 0) {
                terrainTypes.add(gridArray[ni][nj]);
            }
        }

        return terrainTypes.size >= 3;
    };

    // Check each cell in the grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === "town" && checkNeighbors(i, j)) {
                missionScore += 3;
            }
        }
    }

    return missionScore;
}

// Magicians' valley
function calculateMagiciansValleyScore() {
    let missionScore = 0;

    mountainCoordinates.forEach(mountain => {
        // Defining the coordinates to check (above, below, left, right)
        const adjacentCoordinates = [
            { x: mountain.row - 1, y: mountain.column }, // Above
            { x: mountain.row + 1, y: mountain.column }, // Below
            { x: mountain.row, y: mountain.column - 1 }, // Left
            { x: mountain.row, y: mountain.column + 1 }, // Right
        ];

        adjacentCoordinates.forEach(coord => {
            //Adjusting for zero-based indexing
            let ni = coord.x - 1;
            let nj = coord.y - 1;

            if (gridArray[ni][nj] === "water") {
                missionScore += 3;
            }
        })

    });

    return missionScore;
}

// Empty site
function calculateEmptySiteScore() {
    let missionScore = 0;

    const checkNeighbors = (i, j) => {
        let emptyNeighborCount = 0;
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        directions.forEach(([dx, dy]) => {
            let ni = i + dx, nj = j + dy;
            if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize && gridArray[ni][nj] === 0) {
                emptyNeighborCount++;
            }
        });

        return emptyNeighborCount;
    };

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === "town") {
                missionScore += 2 * checkNeighbors(i, j);
            }
        }
    }
    return missionScore;

}

//Row of houses
function calculateTerracedHouseScore() {
    let missionScore = 0;
    let maxUninterruptedTownLength = 0;
    let maxRowMatchCount = 0;

    for (let i = 0; i < gridSize; i++) {
        let currentUninterruptedLength = 0;
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] === "town") currentUninterruptedLength++;
            else {
                if (currentUninterruptedLength > maxUninterruptedTownLength) {
                    maxUninterruptedTownLength = currentUninterruptedLength;
                    maxRowMatchCount = 1;
                } else if (currentUninterruptedLength === maxUninterruptedTownLength) {
                    maxRowMatchCount++;
                }
                currentUninterruptedLength = 0;
            }
        }
        if (maxUninterruptedTownLength < currentUninterruptedLength) {
            maxUninterruptedTownLength = currentUninterruptedLength;
            maxRowMatchCount = 1;
        } else
            if (maxRowMatchCount === currentUninterruptedLength) {
                maxRowMatchCount++;
            }
    }

    missionScore = 2 * maxUninterruptedTownLength * maxRowMatchCount;
    return missionScore;
}

// Odd numbered silos
function calculateOddNumberedSilosScore() {
    let missionScore = 0;

    for (let i = 0; i < gridSize; i += 2) {
        let isFull = true;
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[j][i] === 0) {
                isFull = false;
                break;
            }
        }
        if (isFull) missionScore += 10;
    }

    return missionScore;
}

// Rich countryside
function calculateRichCountrysideScore() {
    let missionScore = 0;

    for (let i = 0; i < gridSize; i++) {
        let types = new Set();
        for (let j = 0; j < gridSize; j++) {
            if (gridArray[i][j] !== 0) {
                types.add(gridArray[i][j]);
            }
        }
        if (types.size >= 5) missionScore += 4;
    }

    return missionScore;
}

// Getting the current season based on elapsed time units
function getCurrentSeason(timeUnitsElapsed) {
    if (timeUnitsElapsed <= 7) {
        return "Spring";
    } else if (timeUnitsElapsed <= 14) {
        return "Summer";
    } else if (timeUnitsElapsed <= 21) {
        return "Autumn";
    } else {
        return "Winter";
    }
}

// Highlighting active missions
function highlightMissions(...activeMissions) {
    // Remove the highlight class from all mission elements
    const allMissionElements = document.querySelectorAll('.mission');
    allMissionElements.forEach((missionElement) => {
        missionElement.classList.remove('highlighted-mission');
    });

    // Loop through active missions and highlight them
    activeMissions.forEach((missionName) => {
        let missionElement = document.getElementById(missionName);
        if (missionElement) {
            missionElement.classList.add('highlighted-mission');
        }
    });
}