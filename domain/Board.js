export class Board {
    constructor() {
        this.cellSize = 16; 
        this.updateDimensions(window.innerWidth, window.innerHeight);
    }

    updateDimensions(width, height) {
        this.width = Math.floor(width / this.cellSize);
        this.height = Math.floor(height / this.cellSize);
    }

    createGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                grid[y][x] = true;
            }
        }
        return grid;
    }

    getValidLocations(grid) {
        const validLocations = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x]) {
                    validLocations.push({ x, y });
                }
            }
        }
        return validLocations;
    }
}
