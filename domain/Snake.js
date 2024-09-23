export class Snake {
    constructor(scene, x, y) {
        this.scene = scene;
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();
        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);
        this.alive = true;
        this.speed = 100;
        this.moveTime = 0;
        this.tail = new Phaser.Geom.Point(x, y);
        this.heading = 3;  
        this.direction = 3; 
    }

    update(time) {
        if (time >= this.moveTime) {
            return this.move(time);
        }
    }

    faceLeft() {
        if (this.direction === 0 || this.direction === 1) {
            this.heading = 2;  
        }
    }

    faceRight() {
        if (this.direction === 0 || this.direction === 1) {
            this.heading = 3; 
        }
    }

    faceUp() {
        if (this.direction === 2 || this.direction === 3) {
            this.heading = 0; 
        }
    }

    faceDown() {
        if (this.direction === 2 || this.direction === 3) {
            this.heading = 1;  
        }
    }

    move(time) {
        switch (this.heading) {
            case 2:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, this.scene.board.width);
                break;
            case 3:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, this.scene.board.width);
                break;
            case 0:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, this.scene.board.height);
                break;
            case 1:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, this.scene.board.height);
                break;
        }
    
        this.direction = this.heading;
    
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);
    
        const hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
    
        if (hitBody) {
            this.alive = false;
            return false;
        } else {
            this.moveTime = time + this.speed;
            return true;
        }
    }
    
    

    grow() {
        const newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
    }

    collideWithFood(food) {
        if (!food || !food.food) {

        console.error("Food instance is undefined or uninitialized.");
        return false;
    }
        if (this.head.x === food.food.x && this.head.y === food.food.y) {
            this.grow();
            food.eat();
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }
            return true;
        } else {
            return false;
        }
    }
    

    updateGrid(grid) {
    this.body.children.each(segment => {
        const bx = segment.x / 16;
        const by = segment.y / 16;

        if (bx >= 0 && bx < grid[0].length && by >= 0 && by < grid.length) {
            grid[by][bx] = false;
        }
    });
    return grid;
}

    
}
