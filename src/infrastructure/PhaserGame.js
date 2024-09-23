import { MainScene } from "../application/MainScene.js"

export class PhaserGame {
    constructor() {
        this.config = {
            type: Phaser.WEBGL,
            width: window.innerWidth,  
            height: window.innerHeight,
            backgroundColor: '#7b51c9',
            parent: 'game_container',
            scene: MainScene
        };

        this.game = new Phaser.Game(this.config);

        
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        
        this.game.scale.resize(width, height);
        
        
        if (this.board) {
            this.board.updateDimensions(width, height);
            this.snake.updateGrid(this.board.createGrid());
            this.repositionFood();
        }
    }
    
}