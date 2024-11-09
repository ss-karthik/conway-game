console.log("conway!");
const gridContainer = document.querySelector(".grid-container");
const gameControls = document.querySelector(".game-controls");

class Game {
    testing;
    gameStarted;
    playGrid;
    gameLoopInterval;
    constructor(){
        this.testing = false;
        this.gameStarted = false;   
        
        let createButton = document.createElement("button");
        createButton.innerHTML = "Create Game";
        createButton.classList.add("create-button");
        createButton.addEventListener("click", ()=>{
            this.createGame();
        });
        gameControls.appendChild(createButton);

        let startButton = document.createElement("button");
        startButton.innerHTML = "Start Game";
        startButton.classList.add("start-button");
        startButton.addEventListener("click", ()=>{
            this.startGame();
        });
        gameControls.appendChild(startButton);

        let stopButton = document.createElement("button");
        stopButton.innerHTML = "Stop Game";
        stopButton.classList.add("stop-button");
        stopButton.addEventListener("click", ()=>{
            this.stopGame();
        });
        gameControls.appendChild(stopButton);
    }

    createGame(){
        this.stopGame();
        let n = Number(prompt("Enter number of rows: "));
        this.playGrid = new Grid(n);
    }

    startGame(){
        this.gameStarted = true;
        if(this.playGrid){
            this.gameLoopInterval = setInterval(() => {
                this.loopGame();
            }, 500);
        }
    }

    loopGame() {
        let k = this.playGrid.n;
        const nextState = JSON.parse(JSON.stringify(this.playGrid.cells));
        for (let i = 0; i < k; i++) {
            for (let j = 0; j < 2 * k; j++) {
                this.checkCell(i, j, nextState);
            }
        }
        this.playGrid.cells = nextState;
        this.playGrid.buildGrid();
    }
    
    checkCell(i, j, nextState) {
        const neighborOffsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        
        let aliveNeighbors = 0;
        
        for (const [dx, dy] of neighborOffsets) {
            const ni = (i + dx + this.playGrid.n) % this.playGrid.n; 
            const nj = (j + dy + 2 * this.playGrid.n) % (2 * this.playGrid.n);
            aliveNeighbors += this.playGrid.cells[ni][nj];
        }

        if (this.playGrid.cells[i][j] == 1) {
            nextState[i][j] = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
        } else {
            nextState[i][j] = (aliveNeighbors === 3) ? 1 : 0;
        }
    }
    stopGame() {
        if(this.playGrid){
            clearInterval(this.gameLoopInterval);
            this.playGrid.clear();
            this.playGrid = null;
            this.gameStarted = false;
        }
    }
}
const game = new Game();


class Grid {
    cells;
    n;
    constructor(n){
        this.cells = [];
        this.n = n;
        for (let i = 0; i < n; i++) {
            this.cells[i] = []; 
            for (let j = 0; j < 2*n; j++) {
                this.cells[i][j] = 0; 
            }
        }
        this.buildGrid();        
    }

    buildGrid(){
        this.clear();
        let size = 600/this.n;
        for (let i = 0; i < this.n; i++) {
            let row = document.createElement("div");
            row.style.height = size.toString() + "px";
            row.classList.add("row");
            for (let j = 0; j < 2*this.n; j++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute('id', `${i}-${j}`);
                
                if(this.cells[i][j]===0){
                    cell.style.backgroundColor = "white";
                } else {
                    cell.style.backgroundColor = "black";
                }

                cell.style.width = size.toString() + "px";
                cell.style.height = size.toString() + "px";

                cell.addEventListener('click', ()=>{
                    this.toggleCellStatus(cell);
                });
                row.appendChild(cell);
            }
            gridContainer.appendChild(row);
        }
    }

    
    toggleCellStatus = (cell) => {
        if(!game.gameStarted){
            let strg = cell.id;
            console.log(strg);
            const [row, col] = strg.split('-').map(Number);

            if(this.cells[row][col] === 1){
                this.cells[row][col]=0;
            } else {
                this.cells[row][col]=1;
            }
            console.log(this.cells[row][col]);
            this.buildGrid();
        }
    }
    clear = () => {
        let gridContainer = document.querySelector(".grid-container");
        gridContainer.innerHTML = "";
    }
}
