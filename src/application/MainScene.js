import { Snake } from '../domain/Snake.js';
import { Food } from '../domain/Food.js';
import { Block } from '../domain/Block.js';
import { Board } from '../domain/Board.js';

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.snake = null;
        this.food = null;
        this.block = null;
        this.cursors = null;
        this.isPaused = false;
        this.timerWorker = null;
        this.foodWorker = null;
        this.blockWorker = null; 
        this.timerText = null;
    }

    preload() {
        this.load.image('food', './assets/food.png');
        this.load.image('body', './assets/body.png');
        this.load.image('block', './assets/block.png');  
    }

    create() {
        this.board = new Board(this);
        this.food = new Food(this, 3, 4);
        this.snake = new Snake(this, 8, 8);
        
        
        this.createFoodWorker();
        this.createBlockWorker();  
        this.startTimer();  

        this.timerText = this.add.text(0, 0, '00:00', {
            fontSize: '32px',
            fill: '#ffffff'
        });
        this.centerTimerText();

        this.cursors = this.input.keyboard.createCursorKeys();

        const pauseButton = document.getElementById('pauseButton');
        pauseButton.addEventListener('click', () => {
            this.togglePause(pauseButton);
        });
    }

    createFoodWorker() {
        if (typeof(Worker) !== "undefined") {
            this.foodWorker = new Worker('./infrastructure/workers/foodWorker.js');
            this.foodWorker.onmessage = (e) => {
                const { action, position } = e.data;
                if (action === "repositioned" && position) {
                    this.food.setPosition(position.x, position.y);  
                }
            };
        }
    }

    createBlockWorker() {
        if (typeof(Worker) !== "undefined") {
            this.blockWorker = new Worker('./infrastructure/workers/blockWorker.js');
            const validLocations = this.board.getValidLocations(this.snake.updateGrid(this.board.createGrid()));

            this.blockWorker.postMessage({ action: "reposition", data: { validLocations } });

            this.blockWorker.onmessage = (e) => {
                const { action, position } = e.data;
                if (action === "repositioned" && position) {
                    this.block = new Block(this, position.x, position.y);
                }
            };
        }
    }

    startTimer() {
        if (typeof(Worker) !== "undefined") {
            this.timerWorker = new Worker('./infrastructure/workers/timerWorker.js');
            this.timerWorker.postMessage({ action: "start" });  
            this.timerWorker.onmessage = (e) => {
                const { minutes, seconds } = e.data;
                const formattedTime = this.pad(minutes) + ':' + this.pad(seconds);
                this.timerText.setText(formattedTime);
                this.centerTimerText();
            };
        }
    }

    togglePause(button) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.timerWorker.postMessage({ action: "pause" });
            button.textContent = 'Reanudar';
        } else {
            this.timerWorker.postMessage({ action: "resume" });  
            button.textContent = 'Pausa';
        }
    }

    pad(number) {
        return number < 10 ? '0' + number : number;
    }

    centerTimerText() {
        const gameWidth = this.game.config.width;
        this.timerText.x = gameWidth / 2 - this.timerText.width / 2;
    }

    update(time) {
        if (!this.snake.alive) {
            this.timerWorker.postMessage({ action: "pause" });
            return;
        }
    
        if (this.isPaused) return;
    
        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        } else if (this.cursors.right.isDown) {
            this.snake.faceRight();
        } else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        } else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }
    
        if (this.snake.update(time)) {
            if (this.snake.collideWithFood(this.food)) {
                this.foodWorker.postMessage({ action: "eat" });
                this.repositionFood();
            }
    
            if (this.block && this.snake.head.x === this.block.block.x && this.snake.head.y === this.block.block.y) {
                
                this.block.destroy();
                
                this.block = null;
    
                this.repositionBlock();
            }
        }
    }
    
    repositionBlock() {
        const testGrid = this.board.createGrid();
        this.snake.updateGrid(testGrid);
    
        const validLocations = this.board.getValidLocations(testGrid);
    
        if (validLocations.length > 0) {
            this.blockWorker.postMessage({ action: "reposition", data: { validLocations } });
        }
    }
    
    

    repositionFood() {
        const testGrid = this.board.createGrid();
        this.snake.updateGrid(testGrid);
        const validLocations = this.board.getValidLocations(testGrid);

        if (validLocations.length > 0) {
            this.foodWorker.postMessage({ action: "reposition", data: { validLocations } });
        }
    }

    destroy() {
        if (this.timerWorker) {
            this.timerWorker.terminate();
        }
        if (this.foodWorker) {
            this.foodWorker.terminate();
        }
        if (this.blockWorker) {
            this.blockWorker.terminate();
        }
    }
}
