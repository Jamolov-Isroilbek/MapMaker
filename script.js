/**
 * The Mapmaker - A tile-placement strategy game
 * 
 * Players place terrain elements on an 11x11 grid across four seasons,
 * scoring points based on randomly selected mission objectives.
 */

// =============================================================================
// CONFIGURATION & CONSTANTS
// =============================================================================

const CONFIG = {
    GRID_SIZE: 11,
    TOTAL_TIME_UNITS: 28,
    TIME_PER_SEASON: 7,
    MOUNTAIN_BONUS: 1,
    
    TERRAIN_TYPES: ['forest', 'water', 'town', 'farm'],
    
    SEASONS: ['Spring', 'Summer', 'Autumn', 'Winter'],
    
    SEASON_MISSIONS: {
        Spring: ['A', 'B'],
        Summer: ['B', 'C'],
        Autumn: ['C', 'D'],
        Winter: ['A', 'D']
    }
};

const MOUNTAIN_COORDINATES = [
    { row: 2, column: 2 },
    { row: 4, column: 9 },
    { row: 6, column: 4 },
    { row: 9, column: 10 },
    { row: 10, column: 6 }
];

const ELEMENTS = [
    { time: 2, type: 'water', shape: [[1, 1, 1]] },
    { time: 2, type: 'town', shape: [[1, 1, 1]] },
    { time: 1, type: 'forest', shape: [[1, 1, 0], [0, 1, 1]] },
    { time: 2, type: 'farm', shape: [[1, 1, 1], [0, 0, 1]] },
    { time: 2, type: 'forest', shape: [[1, 1, 1], [0, 0, 1]] },
    { time: 2, type: 'town', shape: [[1, 1, 1], [0, 1, 0]] },
    { time: 2, type: 'farm', shape: [[1, 1, 1], [0, 1, 0]] },
    { time: 1, type: 'town', shape: [[1, 1], [1, 0]] },
    { time: 1, type: 'town', shape: [[1, 1, 1], [1, 1, 0]] },
    { time: 1, type: 'farm', shape: [[1, 1, 0], [0, 1, 1]] },
    { time: 1, type: 'farm', shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
    { time: 2, type: 'water', shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
    { time: 2, type: 'water', shape: [[1, 0, 0], [1, 1, 1], [1, 0, 0]] },
    { time: 2, type: 'forest', shape: [[1, 1, 0], [0, 1, 1], [0, 0, 1]] },
    { time: 2, type: 'forest', shape: [[1, 1, 0], [0, 1, 1]] },
    { time: 2, type: 'water', shape: [[1, 1], [1, 1]] }
];

const MISSIONS = {
    basic: [
        { title: 'Edge of the forest', description: 'One point for each forest field adjacent to the edge of your map.' },
        { title: 'Sleepy valley', description: 'Four points for every row with exactly three forest fields.' },
        { title: 'Watering potatoes', description: 'Two points for each water field adjacent to your farm fields.' },
        { title: 'Borderlands', description: 'Six points for each full row or column.' }
    ],
    extra: [
        { title: 'Tree line', description: 'Two points per field in the longest vertical uninterrupted forest line.' },
        { title: 'Watering canal', description: 'Four points for columns with equal farm and water fields (at least one each).' },
        { title: 'Wealthy town', description: 'Three points for each town adjacent to at least three different terrain types.' },
        { title: 'Magicians valley', description: 'Three points for each water field adjacent to mountains.' },
        { title: 'Empty site', description: 'Two points for each empty field adjacent to town fields.' },
        { title: 'Row of houses', description: 'Two points per field in the longest horizontal uninterrupted town line.' },
        { title: 'Odd numbered silos', description: 'Ten points for each fully filled odd-numbered column.' },
        { title: 'Rich countryside', description: 'Four points for each row with at least five different terrain types.' }
    ]
};

// =============================================================================
// GAME STATE
// =============================================================================

const GameState = {
    grid: [],
    timeRemaining: CONFIG.TOTAL_TIME_UNITS,
    isGameOver: false,
    
    currentElement: null,
    currentShape: null,
    nextElement: null,
    
    missions: { A: null, B: null, C: null, D: null },
    missionScores: { A: 0, B: 0, C: 0, D: 0 },
    totalScore: 0,
    
    previewCells: [],
    availableMissions: null,

    reset() {
        this.grid = [];
        this.timeRemaining = CONFIG.TOTAL_TIME_UNITS;
        this.isGameOver = false;
        this.currentElement = null;
        this.currentShape = null;
        this.nextElement = null;
        this.missions = { A: null, B: null, C: null, D: null };
        this.missionScores = { A: 0, B: 0, C: 0, D: 0 };
        this.totalScore = 0;
        this.previewCells = [];
        this.availableMissions = [...MISSIONS.basic, ...MISSIONS.extra];
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const GridUtils = {
    isValidPosition(x, y) {
        return x >= 0 && x < CONFIG.GRID_SIZE && y >= 0 && y < CONFIG.GRID_SIZE;
    },

    isCellEmpty(x, y) {
        return this.isValidPosition(x, y) && GameState.grid[y][x] === 0;
    },

    getCellValue(x, y) {
        return this.isValidPosition(x, y) ? GameState.grid[y][x] : null;
    },

    getOrthogonalNeighbors(x, y) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        return directions
            .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
            .filter(pos => this.isValidPosition(pos.x, pos.y));
    },

    countTerrainInRow(row, terrain) {
        return GameState.grid[row].filter(cell => cell === terrain).length;
    },

    countTerrainInColumn(col, terrain) {
        return GameState.grid.filter(row => row[col] === terrain).length;
    },

    isRowComplete(row) {
        return GameState.grid[row].every(cell => cell !== 0);
    },

    isColumnComplete(col) {
        return GameState.grid.every(row => row[col] !== 0);
    }
};

const ShapeUtils = {
    rotate(shape) {
        const height = shape.length;
        const width = shape[0].length;
        const rotated = [];
        
        for (let j = 0; j < width; j++) {
            rotated.push(shape.map(row => row[j]).reverse());
        }
        return rotated;
    },

    flip(shape) {
        return shape.map(row => [...row].reverse());
    },

    hasActiveCells(shape) {
        return shape.some(row => row.some(cell => cell === 1));
    },

    getDimensions(shape) {
        return { width: shape[0].length, height: shape.length };
    },

    getActiveCellPositions(shape, offsetX = 0, offsetY = 0) {
        const positions = [];
        shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    positions.push({ x: offsetX + x, y: offsetY + y });
                }
            });
        });
        return positions;
    }
};

// =============================================================================
// DOM UTILITIES
// =============================================================================

const DOM = {
    elements: {
        gridMap: () => document.querySelector('.grid-map'),
        elementGrid: () => document.querySelector('.element-grid'),
        timeUnit: () => document.querySelector('#timeUnit'),
        elapsedTime: () => document.querySelector('#elapsedTime'),
        currentSeason: () => document.querySelector('#currentSeason'),
        totalPoints: () => document.querySelector('#totalPoints'),
        rotateButton: () => document.querySelector('#rotate-button'),
        flipButton: () => document.querySelector('#flip-button')
    },

    getGridCell(x, y) {
        return document.querySelector(`.grid-cell[data-x='${x + 1}'][data-y='${y + 1}']`);
    },

    getCellCoordinates(cell) {
        if (!cell.classList.contains('grid-cell')) return null;
        return {
            x: parseInt(cell.dataset.x, 10) - 1,
            y: parseInt(cell.dataset.y, 10) - 1
        };
    },

    getMissionElement(letter) {
        return document.querySelector(`#mission${letter}`);
    },

    getMissionScoreElement(letter) {
        return this.getMissionElement(letter)?.querySelector('#missionScore');
    },

    getSeasonElement(season) {
        return document.querySelector(`#${season.toLowerCase()}`);
    }
};

// =============================================================================
// RENDERING
// =============================================================================

const Renderer = {
    createGrid() {
        const container = DOM.elements.gridMap();
        container.innerHTML = '';
        
        for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
            const rowArray = [];
            
            for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.x = col + 1;
                cell.dataset.y = row + 1;

                const isMountain = MOUNTAIN_COORDINATES.some(
                    coord => coord.row === row + 1 && coord.column === col + 1
                );
                
                if (isMountain) {
                    cell.classList.add('grid-mountain');
                    rowArray.push(1);
                } else {
                    rowArray.push(0);
                }
                
                container.appendChild(cell);
            }
            GameState.grid.push(rowArray);
        }
    },

    updateGrid() {
        const cells = document.querySelectorAll('.grid-cell');
        
        cells.forEach((cell, index) => {
            const x = index % CONFIG.GRID_SIZE;
            const y = Math.floor(index / CONFIG.GRID_SIZE);
            
            if (cell.classList.contains('grid-mountain')) return;
            
            const terrain = GameState.grid[y][x];
            cell.className = 'grid-cell';
            
            if (terrain !== 0) {
                cell.classList.add('element-cell', terrain);
            } else {
                cell.classList.add('empty-cell');
            }
        });
    },

    displayElement(shape, type) {
        const grid = DOM.elements.elementGrid();
        const { width, height } = ShapeUtils.getDimensions(shape);
        
        grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;
        grid.innerHTML = '';
        
        shape.forEach(row => {
            row.forEach(cell => {
                const div = document.createElement('div');
                div.classList.add('element-cell');
                div.classList.add(cell === 1 ? type : 'empty-cell');
                grid.appendChild(div);
            });
        });
    },

    updateTimeDisplay() {
        const elapsed = CONFIG.TOTAL_TIME_UNITS - GameState.timeRemaining;
        const seasonTime = elapsed % CONFIG.TIME_PER_SEASON;
        
        DOM.elements.elapsedTime().textContent = seasonTime;
        DOM.elements.timeUnit().textContent = GameState.currentElement?.time || 0;
    },

    updateSeasonDisplay(season) {
        const nextSeasonIndex = (CONFIG.SEASONS.indexOf(season) + 1) % 4;
        const nextSeason = CONFIG.SEASONS[nextSeasonIndex];
        const missions = CONFIG.SEASON_MISSIONS[nextSeason].join('');
        DOM.elements.currentSeason().textContent = `${nextSeason} (${missions})`;
    },

    updateSeasonScore(season, score) {
        const element = DOM.getSeasonElement(season);
        element.querySelector('.points').textContent = score;
    },

    updateTotalScore() {
        DOM.elements.totalPoints().textContent = GameState.totalScore;
    },

    updateMissionScore(letter) {
        const scoreElement = DOM.getMissionScoreElement(letter);
        if (scoreElement) {
            scoreElement.textContent = GameState.missionScores[letter];
        }
    },

    updateMissionImage(letter, mission) {
        const element = DOM.getMissionElement(letter);
        if (element && mission) {
            const filename = mission.title.replace(/\s+/g, '_').toLowerCase();
            element.querySelector('img').src = `assets/missions/${filename}.png`;
        }
    },

    highlightActiveMissions(season) {
        document.querySelectorAll('.mission').forEach(el => {
            el.classList.remove('highlighted-mission');
        });
        
        CONFIG.SEASON_MISSIONS[season].forEach(letter => {
            DOM.getMissionElement(letter)?.classList.add('highlighted-mission');
        });
    },

    clearPreview() {
        document.querySelectorAll('.preview-yes, .preview-no').forEach(cell => {
            cell.classList.remove('preview-yes', 'preview-no');
        });
        GameState.previewCells = [];
    },

    showPreview(positions, isValid) {
        const className = isValid ? 'preview-yes' : 'preview-no';
        
        positions.forEach(({ x, y }) => {
            const cell = DOM.getGridCell(x, y);
            if (cell) cell.classList.add(className);
        });
    }
};

// =============================================================================
// MISSION SCORING
// =============================================================================

const MissionScoring = {
    calculate(mission) {
        const scoreFunctions = {
            'Borderlands': this.borderlands,
            'Edge of the forest': this.edgeOfTheForest,
            'Sleepy valley': this.sleepyValley,
            'Watering potatoes': this.wateringPotatoes,
            'Tree line': this.treeLine,
            'Watering canal': this.wateringCanal,
            'Wealthy town': this.wealthyTown,
            'Magicians valley': this.magiciansValley,
            'Empty site': this.emptySite,
            'Row of houses': this.rowOfHouses,
            'Odd numbered silos': this.oddNumberedSilos,
            'Rich countryside': this.richCountryside
        };
        
        return scoreFunctions[mission.title]?.() || 0;
    },

    borderlands() {
        let score = 0;
        for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
            if (GridUtils.isRowComplete(i)) score += 6;
            if (GridUtils.isColumnComplete(i)) score += 6;
        }
        return score;
    },

    edgeOfTheForest() {
        let score = 0;
        const size = CONFIG.GRID_SIZE;
        
        // Top and bottom edges
        for (let x = 0; x < size; x++) {
            if (GameState.grid[0][x] === 'forest') score++;
            if (GameState.grid[size - 1][x] === 'forest') score++;
        }
        
        // Left and right edges (excluding corners)
        for (let y = 1; y < size - 1; y++) {
            if (GameState.grid[y][0] === 'forest') score++;
            if (GameState.grid[y][size - 1] === 'forest') score++;
        }
        
        return score;
    },

    sleepyValley() {
        let score = 0;
        for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
            if (GridUtils.countTerrainInRow(row, 'forest') === 3) {
                score += 4;
            }
        }
        return score;
    },

    wateringPotatoes() {
        let score = 0;
        
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                if (GameState.grid[y][x] !== 'water') continue;
                
                const hasAdjacentFarm = GridUtils.getOrthogonalNeighbors(x, y)
                    .some(pos => GridUtils.getCellValue(pos.x, pos.y) === 'farm');
                
                if (hasAdjacentFarm) score += 2;
            }
        }
        return score;
    },

    treeLine() {
        let maxLength = 0;
        
        for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
            let currentLength = 0;
            
            for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
                if (GameState.grid[row][col] === 'forest') {
                    currentLength++;
                    maxLength = Math.max(maxLength, currentLength);
                } else {
                    currentLength = 0;
                }
            }
        }
        
        return maxLength * 2;
    },

    wateringCanal() {
        let score = 0;
        
        for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
            const farmCount = GridUtils.countTerrainInColumn(col, 'farm');
            const waterCount = GridUtils.countTerrainInColumn(col, 'water');
            
            if (farmCount === waterCount && farmCount > 0) {
                score += 4;
            }
        }
        return score;
    },

    wealthyTown() {
        let score = 0;
        
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                if (GameState.grid[y][x] !== 'town') continue;
                
                const neighborTypes = new Set(
                    GridUtils.getOrthogonalNeighbors(x, y)
                        .map(pos => GridUtils.getCellValue(pos.x, pos.y))
                        .filter(val => val !== 0 && val !== null)
                );
                
                if (neighborTypes.size >= 3) score += 3;
            }
        }
        return score;
    },

    magiciansValley() {
        let score = 0;
        
        MOUNTAIN_COORDINATES.forEach(mountain => {
            const x = mountain.column - 1;
            const y = mountain.row - 1;
            
            GridUtils.getOrthogonalNeighbors(x, y).forEach(pos => {
                if (GridUtils.getCellValue(pos.x, pos.y) === 'water') {
                    score += 3;
                }
            });
        });
        
        return score;
    },

    emptySite() {
        let score = 0;
        
        for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
            for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                if (GameState.grid[y][x] !== 'town') continue;
                
                const emptyNeighbors = GridUtils.getOrthogonalNeighbors(x, y)
                    .filter(pos => GridUtils.isCellEmpty(pos.x, pos.y)).length;
                
                score += emptyNeighbors * 2;
            }
        }
        return score;
    },

    rowOfHouses() {
        let maxLength = 0;
        
        for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
            let currentLength = 0;
            
            for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
                if (GameState.grid[row][col] === 'town') {
                    currentLength++;
                    maxLength = Math.max(maxLength, currentLength);
                } else {
                    currentLength = 0;
                }
            }
        }
        
        return maxLength * 2;
    },

    oddNumberedSilos() {
        let score = 0;
        
        for (let col = 0; col < CONFIG.GRID_SIZE; col += 2) {
            if (GridUtils.isColumnComplete(col)) {
                score += 10;
            }
        }
        return score;
    },

    richCountryside() {
        let score = 0;
        
        for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
            const terrainTypes = new Set(
                GameState.grid[row].filter(cell => cell !== 0)
            );
            
            if (terrainTypes.size >= 5) score += 4;
        }
        return score;
    },

    surroundedMountains() {
        let count = 0;
        
        MOUNTAIN_COORDINATES.forEach(mountain => {
            const x = mountain.column - 1;
            const y = mountain.row - 1;
            
            const filledNeighbors = GridUtils.getOrthogonalNeighbors(x, y)
                .filter(pos => !GridUtils.isCellEmpty(pos.x, pos.y)).length;
            
            if (filledNeighbors === 4) count++;
        });
        
        return count;
    }
};

// =============================================================================
// GAME LOGIC
// =============================================================================

const GameController = {
    init() {
        GameState.reset();
        Renderer.createGrid();
        
        this.initializeMissions();
        this.setupNextElement();
        this.setupEventListeners();
        
        const currentSeason = this.getCurrentSeason();
        Renderer.highlightActiveMissions(currentSeason);
        DOM.elements.currentSeason().textContent = `${currentSeason} (${CONFIG.SEASON_MISSIONS[currentSeason].join('')})`;
    },

    initializeMissions() {
        ['A', 'B', 'C', 'D'].forEach(letter => {
            const mission = this.getRandomMission();
            GameState.missions[letter] = mission;
            Renderer.updateMissionImage(letter, mission);
        });
    },

    getRandomMission() {
        if (GameState.availableMissions.length === 0) return null;
        
        const index = Math.floor(Math.random() * GameState.availableMissions.length);
        return GameState.availableMissions.splice(index, 1)[0];
    },

    setupNextElement() {
        GameState.nextElement = GameState.nextElement || this.getRandomElement();
        GameState.currentElement = GameState.nextElement;
        GameState.currentShape = [...GameState.currentElement.shape.map(row => [...row])];
        GameState.nextElement = this.getRandomElement();
        
        Renderer.displayElement(GameState.currentShape, GameState.currentElement.type);
        Renderer.updateTimeDisplay();
    },

    getRandomElement() {
        return ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    },

    setupEventListeners() {
        const gridMap = DOM.elements.gridMap();
        
        gridMap.addEventListener('mouseover', (e) => {
            const coords = DOM.getCellCoordinates(e.target);
            if (coords) this.handlePreview(coords);
        });
        
        gridMap.addEventListener('click', (e) => {
            const coords = DOM.getCellCoordinates(e.target);
            if (coords) this.handlePlacement(coords);
        });
        
        DOM.elements.rotateButton().addEventListener('click', () => {
            GameState.currentShape = ShapeUtils.rotate(GameState.currentShape);
            Renderer.displayElement(GameState.currentShape, GameState.currentElement.type);
        });
        
        DOM.elements.flipButton().addEventListener('click', () => {
            GameState.currentShape = ShapeUtils.flip(GameState.currentShape);
            Renderer.displayElement(GameState.currentShape, GameState.currentElement.type);
        });
    },

    handlePreview(position) {
        Renderer.clearPreview();
        
        const { width, height } = ShapeUtils.getDimensions(GameState.currentShape);
        const adjustedPos = {
            x: Math.min(position.x, CONFIG.GRID_SIZE - width),
            y: Math.min(position.y, CONFIG.GRID_SIZE - height)
        };
        
        const positions = ShapeUtils.getActiveCellPositions(
            GameState.currentShape, 
            adjustedPos.x, 
            adjustedPos.y
        );
        
        const isValid = positions.every(pos => GridUtils.isCellEmpty(pos.x, pos.y));
        
        GameState.previewCells = isValid ? positions : [];
        Renderer.showPreview(positions, isValid);
    },

    handlePlacement(clickPos) {
        if (GameState.isGameOver) return;
        
        if (GameState.previewCells.length > 0) {
            this.placeElement();
        }
    },

    placeElement() {
        // Place the shape on the grid
        GameState.previewCells.forEach(({ x, y }) => {
            GameState.grid[y][x] = GameState.currentElement.type;
        });
        
        GameState.timeRemaining -= GameState.currentElement.time;
        Renderer.updateGrid();
        
        // Check for season end before getting next element
        const elapsed = CONFIG.TOTAL_TIME_UNITS - GameState.timeRemaining;
        const currentSeasonTime = elapsed % CONFIG.TIME_PER_SEASON;
        
        if (currentSeasonTime === 0 || 
            (currentSeasonTime === 1 && GameState.currentElement.time === 2)) {
            this.handleSeasonEnd(elapsed - 1);
        }
        
        // Check for game end
        if (GameState.timeRemaining <= 0) {
            this.endGame();
            return;
        }
        
        // Setup next element
        this.setupNextElement();
        
        // Check if placement is still possible
        if (!this.canPlaceAnyShape()) {
            this.endGame('No legal placements remaining');
            return;
        }
        
        Renderer.updateTimeDisplay();
    },

    getCurrentSeason() {
        const elapsed = CONFIG.TOTAL_TIME_UNITS - GameState.timeRemaining;
        const seasonIndex = Math.min(
            Math.floor(elapsed / CONFIG.TIME_PER_SEASON),
            CONFIG.SEASONS.length - 1
        );
        return CONFIG.SEASONS[seasonIndex];
    },

    handleSeasonEnd(elapsedTime) {
        const seasonIndex = Math.floor(elapsedTime / CONFIG.TIME_PER_SEASON);
        const season = CONFIG.SEASONS[seasonIndex];
        const activeMissions = CONFIG.SEASON_MISSIONS[season];
        
        // Calculate scores for active missions
        let seasonScore = 0;
        
        activeMissions.forEach(letter => {
            const mission = GameState.missions[letter];
            const score = MissionScoring.calculate(mission);
            GameState.missionScores[letter] += score;
            seasonScore += score;
            Renderer.updateMissionScore(letter);
        });
        
        // Add mountain bonus
        seasonScore += MissionScoring.surroundedMountains();
        
        // Update displays
        Renderer.updateSeasonScore(season, seasonScore);
        GameState.totalScore += seasonScore;
        Renderer.updateTotalScore();
        
        // Update for next season
        if (seasonIndex < CONFIG.SEASONS.length - 1) {
            const nextSeason = CONFIG.SEASONS[seasonIndex + 1];
            Renderer.updateSeasonDisplay(season);
            Renderer.highlightActiveMissions(nextSeason);
        }
    },

    canPlaceAnyShape() {
        let shape = GameState.currentShape;
        
        for (let rotation = 0; rotation < 4; rotation++) {
            for (let y = 0; y < CONFIG.GRID_SIZE; y++) {
                for (let x = 0; x < CONFIG.GRID_SIZE; x++) {
                    if (this.isPlacementValid(shape, x, y)) {
                        return true;
                    }
                }
            }
            shape = ShapeUtils.rotate(shape);
        }
        return false;
    },

    isPlacementValid(shape, startX, startY) {
        const positions = ShapeUtils.getActiveCellPositions(shape, startX, startY);
        
        return positions.every(({ x, y }) => 
            GridUtils.isValidPosition(x, y) && GridUtils.isCellEmpty(x, y)
        );
    },

    endGame(reason = '') {
        GameState.isGameOver = true;
        const message = reason 
            ? `Game Over: ${reason}\nYour total score is: ${GameState.totalScore}`
            : `Game Over! Your total score is: ${GameState.totalScore}`;
        alert(message);
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    GameController.init();
});
