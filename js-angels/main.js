const GRAVITY = 2000;

class Player {
    constructor(sprite) {
        this.sprite = sprite;
        this.sprite.allowRotation = true;
        this.body = sprite.body;
        this.rotation = 0;
        this.grounded = false;
        this.walled = false;
        this.whichWall = false;
        this.flip = false;

        this.JUMP = -1000;
        this.SPEED = 500;
        this.TURN = 10;
    }

    update(cursors) {
        this.grounded = this.body.blocked.down;
        this.walled = this.body.blocked.right || this.body.blocked.left;
        if (this.grounded || this.walled) this.rotation = 0;
        this.sprite.angle = this.rotation % 360;
        this.sprite.flipX = this.flip;

        if (cursors.left.isDown) {
            if (this.grounded) this.flip = true;
            this.grounded ? this.sprite.setVelocityX(-this.SPEED) : this.rotation-=this.TURN;
        }
        else if (cursors.right.isDown) {
            if (this.grounded) this.flip = false;
            this.grounded ? this.sprite.setVelocityX(this.SPEED) : this.rotation+=this.TURN;
        }
        else if (this.grounded) {
            this.sprite.setVelocityX(0);
        }
        if (this.walled) {
            if (!this.grounded) this.sprite.setVelocityX(this.body.blocked.right ? 1 : -1);
            this.whichWall = this.body.blocked.left;
            this.flip = this.body.blocked.right;
            if (this.body.velocity.y > 150) this.sprite.setVelocityY(150);
        }
        if (cursors.up.isDown) {
            if (this.grounded) this.sprite.setVelocityY(this.JUMP);
            else if (this.walled) {
                this.sprite.setVelocityX(this.whichWall ? this.SPEED : -this.SPEED);
                this.sprite.setVelocityY(this.JUMP+200);
            }
            console.log('JUMP')
        }
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    backgroundColor: '#FFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;

function preload ()
{
    this.load.setBaseURL('img/');
    this.load.image('guy', 'AngelsGuy.png');
}

function create ()
{
    player = new Player(this.physics.add.image(400, 100, 'guy').setScale(2));
    cursors = this.input.keyboard.createCursorKeys();

    player.body.collideWorldBounds = true;
}

function update ()
{
    player.update(cursors);
}