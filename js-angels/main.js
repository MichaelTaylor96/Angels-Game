const M = 50;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#FFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 50*M }
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
    player = this.physics.add.image(400, 100, 'guy').setScale(2);
    cursors = this.input.keyboard.createCursorKeys();

    player.body.collideWorldBounds = true;
    this.physics.add.collider(player, platforms);
}

function update ()
{
    if (cursors.left.isDown) {
        player.setVelocityX(-10*M);
        console.log('LEFT');
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(10*M);
        console.log('RIGHT');
    }
    else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.blocked.down) {
        player.setVelocityY(-22*M);
        console.log('JUMP')
    }
}