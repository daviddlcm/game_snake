export class Food {
    constructor(scene, x, y) {
        this.scene = scene;
        this.position = new Phaser.Geom.Point(x, y);
        this.food = scene.add.image(x * 16, y * 16, 'food');
        this.food.setOrigin(0);
        this.total = 0;
    }
    updateGrid(grid) {
        const fx = this.position.x;
        const fy = this.position.y;
    
        if (fx >= 0 && fx < grid[0].length && fy >= 0 && fy < grid.length) {
            grid[fy][fx] = false; 
        }
    
        return grid;
    }
    

    eat() {
        this.total++;
    }

    setPosition(x, y) {
        this.position.setTo(x, y);  
        this.food.setPosition(x * 16, y * 16);  
    }
}
