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
        this.MAXSPEED = 500;
        this.ACCELERATION = 10000;
        this.MAXFALL = 1000
        this.TURN = 20;
    }

    update(cursors) {
        this.grounded = this.body.blocked.down;
        this.walled = this.body.blocked.right || this.body.blocked.left;
        if (this.grounded || this.walled) this.rotation = 0;
        this.sprite.angle = this.rotation % 360;
        this.sprite.flipX = this.flip;

        if (this.body.velocity.y > this.MAXFALL) {
            this.body.setVelocityY(this.MAXFALL);
        }
        if (Math.abs(this.body.velocity.x) > this.MAXSPEED) {
            this.body.setAccelerationX(0);
        }
        if (cursors.left.isDown) {
            if (this.grounded) this.flip = true;
            if (this.grounded && Math.abs(this.body.velocity.x) < this.MAXSPEED) {
                this.body.setAccelerationX(-this.ACCELERATION);
            } else { this.rotation-=this.TURN };
        }
        else if (cursors.right.isDown) {
            if (this.grounded) this.flip = false;
            if (this.grounded && Math.abs(this.body.velocity.x) < this.MAXSPEED) {
                this.body.setAccelerationX(this.ACCELERATION);
            } else { this.rotation+=this.TURN };
        }
        else if (this.grounded) {
            this.body.setVelocityX(0);
        }
        if (this.walled) {
            if (!this.grounded) this.body.setVelocityX(this.body.blocked.right ? 1 : -1);
            this.whichWall = this.body.blocked.left;
            this.flip = this.body.blocked.right;
            this.body.setAccelerationY(-1000);
        }
        if (cursors.up.isDown) {
            this.body.setVelocityY(this.JUMP);
            if (this.grounded) this.body.setVelocityY(this.JUMP);
            else if (this.walled) {
                this.body.setVelocityX(this.whichWall ? this.SPEED : -this.SPEED);
                this.body.setVelocityY(this.JUMP+200);
            }
            console.log('JUMP')
        }
    }
}

class Angel {
    constructor(sprite) {
        this.sprite = sprite;
        this.body = sprite.body;
        this.body.mass = 0;
        this.TOPSPEED = -1500;
        this.ACCELERATION = (-1*(GRAVITY))-100;
    }

    update() {
        if (this.body.velocity.y > this.TOPSPEED) {
            this.body.setAccelerationY(this.ACCELERATION);
        } else {
            this.body.setVelocityY(this.TOPSPEED)
        };

        if (this.body.y < -200) this.destroy();
    }

    destroy() {
        angels.splice(angels.indexOf(this), 1);
        this.sprite.destroy();
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
const SPAWNRATE = 3;
var player;
var angels;
var seconds;
var cursors;

function preload ()
{
    this.load.setBaseURL('img/');
    this.load.image('guy', 'AngelsGuy.png');
    this.load.image('angel', 'angel.png');
    this.load.image('tiles', 'tiles.jpg')
}

function create ()
{
    this.physics.world.setBounds(0, 0, 800, 10000);
    this.add.tileSprite(0, 0, 1600, 20000, 'tiles');
    player = new Player(this.physics.add.sprite(400, 9980, 'guy').setScale(2));
    angels = [];
    cursors = this.input.keyboard.createCursorKeys();
    player.body.collideWorldBounds = true;

    this.cameras.main.setViewport(0, 0, 800, 700);
    this.cameras.main.setBounds(0, 0, 800, 10000);
    this.cameras.main.startFollow(player.sprite)
}

function update ()
{
    if (Math.floor(this.time.now/1000) !== seconds) {
        if (seconds % SPAWNRATE === 0) {
            var x = Math.random() * 750;
            var angel = this.physics.add.sprite(x, 9980, 'angel').setScale(.75);
            angels.push(new Angel(angel));
        }
        seconds = Math.floor(this.time.now/1000);
    }
    for (var angel of angels) {
        angel.update();
    }
    player.update(cursors);
}