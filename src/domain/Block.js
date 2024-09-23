export class Block {
    constructor(scene, x, y) {
        this.scene = scene;
        this.position = new Phaser.Geom.Point(x, y);
        this.block = scene.add.image(x * 16, y * 16, 'block'); 
        this.block.setOrigin(0);
    }

    setPosition(x, y) {
        this.position.setTo(x, y);
        this.block.setPosition(x * 16, y * 16);
    }
}
